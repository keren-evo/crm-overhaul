## Key Updates

* **Faith Healthcare** operates in **South Florida** (Miami-Dade, Broward, and Palm Beach Counties), servicing from approximately **Vero Beach / Indian River south to Miami and the Keys**; geographic qualification will be handled by **zip code**.

* The company runs **two primary lines of business**:

  * **Skilled care** – nurses, PTs, OTs, wound care; primarily funded by **Medicare, managed care, and commercial/PPO insurance**; leads typically come via referrals from hospitals, doctors' offices, and nursing homes rather than digital channels.

  * **Long-term care (non-skilled)** – home health aides (HHAs/PCAs); Medicaid-funded (managed Medicaid / long-term care plans such as Molina); this is the **primary digital funnel target**.

* A **separate private-pay model** exists under a different brand/website; not the focus of this engagement.

* Faith recently **migrated fully off Salesforce** (~6 months ago) and built a **proprietary CRM** with \~2.5 full-time developers + CTO; Salesforce was abandoned due to pricing inflexibility and lack of AI integration.

* The meeting covered: **AI chatbot setup on the website, phone agent ("Ava") configuration, follow-up email automation, and CRM webhook integration**.

***

## What to Care About

### Two Separate Lead Funnels

* **Patient funnel**: people seeking to receive care (or family members acting on their behalf — majority are family representatives, not the patient directly).

* **Caregiver funnel**: HHAs and other non-skilled workers actively recruited; some caregivers bring patients with them when switching agencies.

* Agency transfers are **not a current targeting priority**, but are welcomed if they come in.

### Primary Digital Target: Long-Term Care / Medicaid

* Faith's sales team actively pursues people who **don't yet have Medicaid** and helps them get enrolled, as well as those who have Medicaid but need service authorization.

* Another key sales channel: **insurance company case managers** (B2B referral channel).

* Skilled nursing / therapy leads are **not expected to come through digital**; online focus should be on long-term / personal care.

### Insurance Complexity

* Patients may not know their plan (e.g., Molina) is technically Medicaid; the bot should present **multiple-choice insurance options** (top managed Medicaid plans + private pay) rather than just "Medicaid vs. private pay."

* Faith has a **Medicaid transition team** for leads who present with Medicare or other non-qualifying insurance.

* Outlier programs exist (e.g., **APD/iBudget** in Florida, analogous to OPWDD in New York) that should not be ignored.

### Caregiver Qualification

* HHAs **must already be certified**; Faith does not assist with initial certification, only in-service hour updates.

* Uncertified applicants should be told to return once certified; resumes are desirable but **not a hard requirement**.

### Spanish-Language Market

* The phone system already has a **Spanish-language greeting**; a **Spanish bot flow and routing to a Spanish-speaking intake line** should be created in parallel.

***

## Feedback & Concerns

### Bot Flow & Qualification Logic

* Current demo flow was acknowledged as a **starting point needing refinement**; Hillel confirmed willingness to iterate post-launch.

* Age is **not a common disqualifier** and should not be a hard gate in the bot for now; can be added later if needed.

* Physical/functional assessment questions (ADLs like dressing, bathing) are **not required** — if a patient is already Medicaid-qualified, those details aren't needed upfront.

* The insurance question needs to be restructured: show the **5–10 most common managed Medicaid plans** as clickable options so patients recognize their plan by name.

### Phone System Complexity

* The main number (305-228-4800) routes through an IVR first to a receptionist (**Melanie**) before reaching extensions; this is slightly non-standard for AI warm-transfer setup.

* Dee mentioned the possibility of providing **direct extension numbers** (e.g., his own is 402); direct lines are preferred for callback reliability.

* Hillel indicated a future intent to **route warm transfers to a sales team before intake**, rather than directly to intake — this will be reconfigured internally before the next phase.

### CRM Integration

* Faith has their own **API team** and is ready to connect via **webhooks**; integration should be straightforward.

* Email notifications into the CRM may eventually replace direct email alerts to intake staff.

* The follow-up email feature (sending insurance card requests, additional info prompts post-conversation) will send **from** **<hello@faithhealthcare.com>**; Hillel needs to grant OAuth access by clicking the link sent during the call.

***

## Action Items

* [ ] **Hillel** – Click the OAuth authorization link sent to <hello@faithhealthcare.com> to enable automated follow-up emails. *(Assigned to: Hillel, Due: ASAP, Meeting: This call)*

* [ ] **Yoni (LeadTrap)** – Send demo link to all three attendees (Hillel, Dee, Leah) for pressure-testing the bot flow. *(Assigned to: Yoni, Due: Within 24 hours)*

* [ ] **Yoni (LeadTrap)** – Update bot insurance question to multi-choice format with top managed Medicaid plans (Molina, etc.) + private pay option. *(Assigned to: Yoni, Due: Before next call)*

* [ ] **Yoni (LeadTrap)** – Adjust bot form layout to display fields **row by row** (name on one line, DOB on next, etc.). *(Assigned to: Yoni, Due: Before next call)*

* [ ] **Yoni (LeadTrap)** – Build out **Spanish-language bot flow** and configure routing to Spanish intake line. *(Assigned to: Yoni, Due: Before next call)*

* [ ] **Yoni (LeadTrap)** – Send demo/setup link within **24 hours** with implemented changes; full customization call to follow. *(Assigned to: Yoni, Due: Within 24 hours)*

* [ ] **Dee Jacomb** – Send Yoni the **full list of Palm Beach County cities/zip codes** for geographic qualification. *(Assigned to: Dee, Due: During/after call — initiated on call)*

* [ ] **Faith team (Hillel/Dee)** – Finalize AI bot name (**"Ava"** proposed, aligned with corporate umbrella "Evo"); confirm or adjust. *(Assigned to: Hillel/Dee)*

* [ ] **Faith team** – Identify or provision a **direct phone line** for intake (bypassing main IVR) to improve warm-transfer reliability. *(Assigned to: Faith internal, Due: Before go-live)*

* [ ] **Faith team** – Confirm which email address handles **outbound follow-ups** and ensure <hello@faithhealthcare.com> is properly set up for that workflow. *(Assigned to: Hillel/Leah)*

* [ ] **Schedule follow-up call** – Include Faith's **CRM/API team** + a LeadTrap engineer to complete the webhook/CRM integration. *(Assigned to: Both parties)*

***

## Open Questions / Follow-Ups

* **Exact northern service boundary**: "Indian Point" / Indian River area confirmed as approximate northern limit; Vero Beach acceptable, Melbourne borderline — awaiting the Palm Beach County city list from Dee for definitive zip code mapping.

* **Sales team routing**: Hillel intends to eventually route warm transfers to a **sales team first, then intake** — exact flow and timeline TBD internally.

* **Private pay funnel**: A separate private-pay home care brand exists; potential future engagement not scoped in this meeting.

* **Family caregiver / consumer-directed model**: Faith is exploring entering this market in Florida (analogous to New York's consumer-directed model) but it is not active yet — not in scope for current funnel.

* **Referral form on website**: A referral page exists on the Faith site but is not part of the active funnel; potential to activate for doctor/hospital referrals was noted as an opportunity.

* **Bot name confirmation**: "Ava" (A-V-A) is the working name, tied to the corporate "Evo" brand — final sign-off pending.

* **Resume collection**: Optional upload for caregiver applicants — desired if available, but should not be a barrier to form submission.

* **Minimum age qualifier**: Not currently a hard gate; may be revisited once live data reveals patterns.

