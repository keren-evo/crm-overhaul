/**
 * Link Homecare CRM sign-off — browser-stored reviewer comments.
 * Persists in localStorage; export for Teams/email back to framework owner.
 */
(function (global) {
  "use strict";

  var STORAGE_PREFIX = "link-crm-signoff:";
  var REVIEWER_KEY = STORAGE_PREFIX + "reviewer-name";

  var PACKAGE_PAGES = [
    { path: "/glossary/joel-model-signoff-onepager.html", label: "Patient path — one-pager" },
    { path: "/glossary-pipeline-v2.html", label: "Full glossary v2.1" },
    { path: "/flowcharts/pipeline-flowcharts-v1.html", label: "Pipeline flowcharts" },
    { path: "/glossary/drop-reasons-for-signoff.html", label: "Drop reasons" },
  ];

  function docIdFromPath() {
    return location.pathname.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "signoff";
  }

  function storageKey(docId, fieldId) {
    return STORAGE_PREFIX + docId + ":" + fieldId;
  }

  function getReviewerName() {
    try {
      return localStorage.getItem(REVIEWER_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setReviewerName(name) {
    try {
      if (name) localStorage.setItem(REVIEWER_KEY, name);
      else localStorage.removeItem(REVIEWER_KEY);
    } catch (e) {}
  }

  function shouldSkipTable(table) {
    var header = ((table.querySelector("tr") || {}).textContent || "").replace(/\s+/g, " ").toLowerCase();
    if (/role.*name.*(signed|initials).*date/.test(header)) return true;
    if (/reviewer.*signature.*date/.test(header)) return true;
    if (/artifact.*reviewer.*signed/.test(header)) return true;
    if (header.indexOf("tag") !== -1 && header.indexOf("meaning") !== -1 && header.split(" ").length < 8) return true;
    return false;
  }

  function commentColIndex(row) {
    for (var i = 0; i < row.cells.length; i++) {
      if (/comment/i.test(row.cells[i].textContent)) return i;
    }
    return -1;
  }

  function makeTextarea(docId, rowId, placeholder, existing, label) {
    var ta = document.createElement("textarea");
    ta.className = "signoff-comment";
    ta.dataset.rowId = rowId;
    ta.placeholder = placeholder || "Comment or revision…";
    ta.rows = 2;
    try {
      ta.value = localStorage.getItem(storageKey(docId, rowId)) || existing || "";
    } catch (e) {
      ta.value = existing || "";
    }
    ta.dataset.rowLabel = label || "";
    ta.addEventListener("input", function () {
      try {
        if (ta.value) {
          localStorage.setItem(storageKey(docId, rowId), ta.value);
          localStorage.setItem(
            storageKey(docId, rowId + ":label"),
            ta.dataset.rowLabel || label || ""
          );
        } else {
          localStorage.removeItem(storageKey(docId, rowId));
          localStorage.removeItem(storageKey(docId, rowId + ":label"));
        }
      } catch (e) {}
      updatePageCount();
      dispatchChange();
    });
    return ta;
  }

  function enhanceTables(article, docId) {
    article.querySelectorAll("table").forEach(function (table, tableIdx) {
      if (shouldSkipTable(table)) {
        table.classList.add("no-comments");
        return;
      }
      var rows = table.querySelectorAll("tr");
      if (!rows.length) return;
      var headerRow = rows[0];
      var colIdx = commentColIndex(headerRow);
      if (colIdx === -1) {
        var th = document.createElement("th");
        th.textContent = "Comments";
        headerRow.appendChild(th);
        colIdx = headerRow.cells.length - 1;
      }
      for (var i = 1; i < rows.length; i++) {
        var tr = rows[i];
        if (!tr.cells.length) continue;
        var rowId = "t" + tableIdx + "-r" + i;
        var label = (tr.cells[0] && tr.cells[0].textContent.trim()) || "Row " + i;
        var td = tr.cells[colIdx];
        if (!td) {
          td = document.createElement("td");
          tr.appendChild(td);
        }
        if (td.querySelector("textarea.signoff-comment")) continue;
        var existing = td.textContent.trim();
        var ta = makeTextarea(
          docId,
          rowId,
          "Comment on: " + label.slice(0, 48),
          existing && existing !== "—" && existing !== "-" ? existing : "",
          label
        );
        td.textContent = "";
        td.appendChild(ta);
      }
      table.classList.add("signoff-table");
    });
  }

  function enhanceSections(article, docId) {
    article.querySelectorAll("h2").forEach(function (h2, idx) {
      var id = h2.id || "section-" + idx;
      if (!h2.id) h2.id = id;
      if (article.querySelector('[data-section-id="' + id + '"]')) return;
      var wrap = document.createElement("div");
      wrap.className = "section-comment-wrap";
      wrap.dataset.sectionId = id;
      var label = document.createElement("label");
      label.textContent = "Section comment — " + h2.textContent.trim();
      label.setAttribute("for", "sec-" + id);
      var ta = document.createElement("textarea");
      ta.className = "section-comment";
      ta.id = "sec-" + id;
      ta.placeholder = "Comments on this section…";
      var fieldId = "section:" + id;
      try {
        ta.value = localStorage.getItem(storageKey(docId, fieldId)) || "";
      } catch (e) {}
      ta.addEventListener("input", function () {
        try {
          if (ta.value) localStorage.setItem(storageKey(docId, fieldId), ta.value);
          else localStorage.removeItem(storageKey(docId, fieldId));
        } catch (e) {}
        updatePageCount();
        dispatchChange();
      });
      wrap.appendChild(label);
      wrap.appendChild(ta);
      h2.insertAdjacentElement("afterend", wrap);
    });
  }

  function collectFromArticle(article, docId, docTitle) {
    var sections = [];
    var rows = [];
    if (!article) return { docId: docId, title: docTitle, sections: sections, rows: rows };

    article.querySelectorAll("h2").forEach(function (h2) {
      var ta = document.getElementById("sec-" + h2.id);
      if (ta && ta.value.trim()) {
        sections.push({ heading: h2.textContent.trim(), text: ta.value.trim() });
      }
    });

    article.querySelectorAll("table.signoff-table tr").forEach(function (tr, i) {
      if (i === 0) return;
      var ta = tr.querySelector("textarea.signoff-comment");
      if (!ta || !ta.value.trim()) return;
      var item = (tr.cells[0] && tr.cells[0].textContent.trim()) || "Row " + i;
      rows.push({ item: item, text: ta.value.trim() });
    });

    return { docId: docId, title: docTitle, sections: sections, rows: rows };
  }

  function collectAllStored() {
    var stored = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf(STORAGE_PREFIX) !== 0 || key === REVIEWER_KEY) continue;
        var rest = key.slice(STORAGE_PREFIX.length);
        var sep = rest.indexOf(":");
        if (sep === -1) continue;
        var docId = rest.slice(0, sep);
        var fieldId = rest.slice(sep + 1);
        if (!stored[docId]) stored[docId] = {};
        stored[docId][fieldId] = localStorage.getItem(key) || "";
      }
    } catch (e) {}
    return stored;
  }

  function labelForDocId(docId) {
    var found = PACKAGE_PAGES.find(function (p) {
      return docIdFromPathname(p.path) === docId;
    });
    return found ? found.label : docId.replace(/_/g, " ");
  }

  function docIdFromPathname(pathname) {
    return pathname.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "signoff";
  }

  function formatExport(docs, reviewer) {
    var lines = [
      "Link Homecare CRM — Sign-off comments",
      "Reviewer: " + (reviewer || "(not set)"),
      "Exported: " + new Date().toLocaleString(),
      "",
    ];
    var hasContent = false;

    docs.forEach(function (doc) {
      if (!doc.sections.length && !doc.rows.length) return;
      hasContent = true;
      lines.push("=== " + doc.title + " ===");
      lines.push("");
      doc.sections.forEach(function (s) {
        lines.push("## " + s.heading);
        lines.push(s.text);
        lines.push("");
      });
      doc.rows.forEach(function (r) {
        lines.push("- " + r.item + ": " + r.text.replace(/\n/g, " "));
      });
      if (doc.rows.length) lines.push("");
    });

    if (!hasContent) return "";
    return lines.join("\n");
  }

  function buildPackageExport() {
    var reviewer = getReviewerName();
    var stored = collectAllStored();
    var docs = [];

    Object.keys(stored).forEach(function (docId) {
      var fields = stored[docId];
      var doc = { docId: docId, title: labelForDocId(docId), sections: [], rows: [] };
      Object.keys(fields).forEach(function (fieldId) {
        var text = (fields[fieldId] || "").trim();
        if (!text) return;
        if (fieldId.indexOf("section:") === 0) {
          doc.sections.push({
            heading: fieldId.slice("section:".length).replace(/-/g, " "),
            text: text,
          });
        } else if (fieldId.endsWith(":label")) {
          return;
        } else {
          var label = fields[fieldId + ":label"] || fieldId;
          doc.rows.push({ item: label, text: text });
        }
      });
      if (doc.sections.length || doc.rows.length) docs.push(doc);
    });

    var onPage = document.querySelector("article");
    if (onPage) {
      var current = collectFromArticle(onPage, docIdFromPath(), document.title);
      var existing = docs.find(function (d) {
        return d.docId === current.docId;
      });
      if (existing) {
        existing.sections = current.sections;
        existing.rows = current.rows;
      } else if (current.sections.length || current.rows.length) {
        docs.push(current);
      }
    }

    return { reviewer: reviewer, exportedAt: new Date().toISOString(), documents: docs };
  }

  var saveStatusTimer = null;

  function flashSaveStatus(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = "Saved";
    el.classList.add("visible");
    clearTimeout(saveStatusTimer);
    saveStatusTimer = setTimeout(function () {
      el.classList.remove("visible");
    }, 2000);
  }

  function dispatchChange() {
    flashSaveStatus("save-status");
    flashSaveStatus("package-save-status");
    try {
      document.dispatchEvent(new CustomEvent("link-crm-signoff-change"));
    } catch (e) {}
  }

  function updatePageCount() {
    var n = 0;
    document.querySelectorAll("textarea.signoff-comment, textarea.section-comment").forEach(function (ta) {
      if (ta.value.trim()) n++;
    });
    var el = document.getElementById("comment-count");
    if (el) {
      el.textContent = n
        ? n + " comment(s) autosaved on this page"
        : "No comments on this page yet";
    }
    updatePackageCount();
  }

  function countAllComments() {
    var n = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || key.indexOf(STORAGE_PREFIX) !== 0 || key === REVIEWER_KEY) continue;
        var rest = key.slice(STORAGE_PREFIX.length);
        var sep = rest.indexOf(":");
        if (sep === -1) continue;
        var fieldId = rest.slice(sep + 1);
        if (fieldId.endsWith(":label")) continue;
        if ((localStorage.getItem(key) || "").trim()) n++;
      }
    } catch (e) {}
    return n;
  }

  function updatePackageCount() {
    var el = document.getElementById("package-comment-count");
    if (!el) return;
    var n = countAllComments();
    el.textContent = n
      ? n + " comment(s) autosaved across package"
      : "No comments saved yet";
  }

  function copyText(text, emptyMsg) {
    if (!text.trim()) {
      alert(emptyMsg || "No comments to copy yet.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        alert("Copied — paste into Teams or email.");
      });
    } else {
      prompt("Copy these comments:", text);
    }
  }

  function downloadJson(data, filename) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function clearPageComments(article, docId) {
    article.querySelectorAll("textarea.signoff-comment, textarea.section-comment").forEach(function (ta) {
      ta.value = "";
      var fieldId = ta.dataset.rowId;
      if (!fieldId && ta.id) fieldId = "section:" + ta.id.replace(/^sec-/, "");
      if (fieldId) {
        try {
          localStorage.removeItem(storageKey(docId, fieldId));
        } catch (e) {}
      }
    });
    updatePageCount();
  }

  function initPage() {
    var article = document.querySelector("article");
    if (!article) return;
    var docId = docIdFromPath();

    if (!article.querySelector(".signoff-toolbar")) {
      var toolbar = document.createElement("div");
      toolbar.className = "signoff-toolbar";
      toolbar.innerHTML =
        '<span class="signoff-hint">Comments autosave as you type.</span>' +
        '<span id="save-status" class="save-status" aria-live="polite"></span>' +
        '<span id="comment-count">No comments on this page yet</span>' +
        '<button type="button" id="copy-comments-btn" title="Optional — paste into Teams or email">Copy this page</button>';
      article.insertBefore(toolbar, article.firstChild);
    }

    enhanceTables(article, docId);
    enhanceSections(article, docId);
    updatePageCount();

    var copyBtn = document.getElementById("copy-comments-btn");
    if (copyBtn && !copyBtn.dataset.bound) {
      copyBtn.dataset.bound = "1";
      copyBtn.addEventListener("click", function () {
        var data = collectFromArticle(article, docId, document.title);
        var text = formatExport([data], getReviewerName());
        copyText(text, "No comments on this page yet.");
      });
    }

    var clearBtn = document.getElementById("clear-comments-btn");
    if (clearBtn && !clearBtn.dataset.bound) {
      clearBtn.dataset.bound = "1";
      clearBtn.addEventListener("click", function () {
        if (!confirm("Clear all comments on this page?")) return;
        clearPageComments(article, docId);
      });
    }
  }

  function initPackage() {
    updatePackageCount();
    document.addEventListener("link-crm-signoff-change", updatePackageCount);

    var nameInput = document.getElementById("reviewer-name");
    if (nameInput) {
      nameInput.value = getReviewerName();
      nameInput.addEventListener("input", function () {
        setReviewerName(nameInput.value.trim());
        flashSaveStatus("package-save-status");
      });
    }

    var copyAll = document.getElementById("copy-all-comments-btn");
    if (copyAll) {
      copyAll.addEventListener("click", function () {
        var payload = buildPackageExport();
        var text = formatExport(payload.documents, payload.reviewer);
        copyText(text, "No comments yet. Open a document and add comments in the Comments column.");
      });
    }

    var downloadBtn = document.getElementById("download-comments-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", function () {
        var payload = buildPackageExport();
        if (!payload.documents.length) {
          alert("No comments saved yet.");
          return;
        }
        var slug = (payload.reviewer || "reviewer").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        downloadJson(payload, "crm-signoff-comments-" + slug + ".json");
      });
    }

    var importInput = document.getElementById("import-comments-file");
    if (importInput) {
      importInput.addEventListener("change", function () {
        var file = importInput.files && importInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = JSON.parse(reader.result);
            if (data.reviewer) setReviewerName(data.reviewer);
            (data.documents || []).forEach(function (doc) {
              (doc.sections || []).forEach(function (s) {
                var fieldId = "section:" + (s.heading || "").toLowerCase().replace(/\s+/g, "-");
                try {
                  localStorage.setItem(storageKey(doc.docId, fieldId), s.text);
                } catch (e) {}
              });
              (doc.rows || []).forEach(function (r, idx) {
                try {
                  localStorage.setItem(storageKey(doc.docId, "import-r" + idx), r.text);
                } catch (e) {}
              });
            });
            alert("Comments imported. Re-open each document to see them.");
            updatePackageCount();
          } catch (e) {
            alert("Could not read that file.");
          }
        };
        reader.readAsText(file);
        importInput.value = "";
      });
    }
  }

  global.LinkCrmSignoff = {
    initPage: initPage,
    initPackage: initPackage,
    getReviewerName: getReviewerName,
    buildPackageExport: buildPackageExport,
    countAllComments: countAllComments,
  };
})(typeof window !== "undefined" ? window : globalThis);
