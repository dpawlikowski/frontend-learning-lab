# Senior Frontend / Fullstack Interview Lab

Standalone static learning platform for Senior Frontend / Frontend-heavy Fullstack interview preparation. No build step, npm install, server, API key, CDN or backend is required.

## Publish on GitHub Pages

1. Create or open a GitHub repository.
2. Extract this ZIP and upload its **contents** to the repository root. `index.html` must be at the root.
3. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source.
4. Push to `main` (or run the workflow manually in Actions). `.github/workflows/pages.yml` deploys the static site.

The site URL is shown in the GitHub Pages settings/deployment summary. Project repositories usually use `https://USERNAME.github.io/REPOSITORY/`; a `USERNAME.github.io` repository uses the root URL.

## What's included

- Standalone flashcards and the existing research, system-design, cheat-sheet, architecture, messaging, career-case and gamified-learning hubs.
- **Interview Training Lab**, with three modes:
  - **Daily Mission:** five short prompts per local calendar day, using a deterministic daily selection from the flashcard deck plus practical debugging/system-design/career prompts.
  - **Smart Review:** answer first, reveal a reference answer, rate recall and schedule a next review using a simple spaced-repetition interval model.
  - **Interview Mode:** a mock interview flow with technical prompts, a response field, reference answer, senior follow-up and self-rating.
- Progress and answer drafts are saved locally in the browser using `localStorage`. They are not synchronized between browsers/devices and are not sent to a server. Clearing browser data will clear local progress.
- `.nojekyll` disables Jekyll processing for this prebuilt static site.

## Learning design

The training layer emphasizes retrieval practice, spaced repetition, self-explanation and realistic interview formats. Reference answers are guides, not the only acceptable answers. Self-rating is not an objective certification or automatic semantic grading.

## Local preview

Any static server works. For example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Validation

The main inline JavaScript is checked with `node --check`; the HTML structure, duplicate IDs, presence of the training hub, archive integrity and matching copies of `index.html` and the standalone HTML are checked before packaging.

## Interview Training Lab UX update

The standalone app includes three local-first interview practice modes:
- **Daily Mission**: five short prompts per day, with answer-before-reveal flow.
- **Smart Review**: spaced review queue with self-rating and local scheduling.
- **Interview Mode**: mock interview prompts, saved drafts, reference answers, and follow-up questions.

UX/accessibility refinements in this build:
- Responsive tab navigation with clearer descriptions and keyboard-visible focus.
- Better mobile stacking and touch-sized controls.
- Accessible labels for answer fields and an announced daily progress bar.
- Daily mission can be resumed after reload without getting stuck on an already-completed step.
- Smart Review answer drafts persist locally between rerenders.
- Dashboard metrics distinguish overdue reviews from cards that have never been rated.

All training progress remains in this browser's `localStorage`; it is not synced across devices. Clearing site data can erase it. No backend or third-party runtime dependency is required.


## Interview scoring rubric

Interview Mode includes an anchored 0–2 self-assessment for five dimensions: technical correctness, answer structure, trade-offs, edge cases/failure modes, and tests/metrics/evidence. Scores are saved locally per question. At session end, the app summarizes completed rubric scores, answer coverage, and the lowest-rated dimension to target in the next attempt.

- 0 = missing or incorrect
- 1 = partially covered
- 2 = clear and concrete

Scores are self-assessment only; they are not an objective prediction of a hiring decision. The app does not send answers to an AI service or any backend.


## Flashcards: learning-science update

The main flashcard flow now uses an answer-before-reveal sequence: write or mentally retrieve an answer, reveal the reference, compare it with your attempt, then rate how well you recalled it. Drafts are saved locally per card. Ratings schedule the next review and are shared with Smart Review. The detailed answer view prioritizes the card's mechanism explanation, concrete example, practical takeaway and misconception instead of repeating generic study advice on every card. The card faces are scrollable so longer answers remain reachable on mobile and desktop.

Design choices are informed by research on retrieval practice and spacing, not by a claim that one specific UI has been experimentally validated:
- Carpenter, Pan & Butler (2022), *The science of effective learning with spacing and retrieval practice*, Nature Reviews Psychology: https://doi.org/10.1038/s44159-022-00089-1
- McDermott (2021), *Practicing Retrieval Facilitates Learning*, Annual Review of Psychology: https://doi.org/10.1146/annurev-psych-010419-051019
- Trumble et al. (2024), *Systematic review of distributed practice and retrieval practice in health professions education*: https://doi.org/10.1007/s10459-023-10274-3
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*: https://doi.org/10.1007/s10648-025-10076-6

The research supports retrieval practice and spaced practice overall, while also showing that effects depend on context and feedback. This platform is an evidence-informed study aid, not a validated educational intervention. Progress remains in browser `localStorage`; no answers are sent to a backend.


## Global UX/UI and mobile pass

The latest pass reduces cognitive overload in the flashcard answer side by keeping the core answer, model mental, mechanism and example visible while grouping interview trade-offs and common misconceptions into an expandable section. Each card includes a short transfer prompt to encourage explaining the concept in a new situation instead of recognizing familiar wording.

Responsive refinements include:
- A horizontally scrollable, touch-friendly hub navigation instead of wrapping a long row of tabs.
- A more compact filter layout on mobile, with controls sized for touch and no oversized sticky toolbar.
- A natural-flow flashcard layout on small screens; the answer opens through an explicit button instead of relying on a 3D flip interaction.
- More readable question and answer typography, improved code overflow handling, and a two-column review list where space permits.
- Consistent visible keyboard focus, reduced-motion support, and clearer focus/scroll behavior.
- Better progressive disclosure for long answers while preserving deeper interview material and source links.

Validation in this build: the inline JavaScript passes `node --check`; HTML has no duplicate IDs; the main and standalone HTML copies match. A full browser-based end-to-end test has not been run.

## Learning-science and study-queue pass (October 2026)

This iteration adds a focused 10-card study queue to the flashcard hub. The queue prioritizes cards whose scheduled review is due, then unseen cards, and interleaves categories where possible to reduce long runs of near-identical topics. It shows a live session position and a completion state. The existing interval ratings and local progress storage are preserved.

Transfer prompts are now adapted to the card's subject: security cards ask about trust boundaries and bypasses; architecture/distributed-systems cards ask what changes under load or dependency failure; code-oriented cards ask for predicted behavior and a changed edge case; performance cards ask for a measurable verification plan. This makes the post-recall challenge more specific than a single repeated instruction.

Keyboard support is aligned with the visible hint: arrows navigate, Space reveals the answer, and after revealing the answer keys 1–4 rate recall difficulty (again, partial, good, easy). When the answer is hidden, 1–3 continue to set the card status. Shortcuts do not fire while the user is typing in an input, textarea or select, or while modifier keys are held.

Research basis:
- Carpenter, Pan & Butler, “The science of effective learning with spacing and retrieval practice,” Nature Reviews Psychology (2022): https://doi.org/10.1038/s44159-022-00089-1
- Trumble et al., “Systematic review of distributed practice and retrieval practice in health professions education,” Advances in Health Sciences Education (2024): https://doi.org/10.1007/s10459-023-10274-3
- Gonçalves, Muniz & Jaeger, “Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review,” Educational Psychology Review (published 2025): https://doi.org/10.1007/s10648-025-10076-6

These studies support retrieval practice and spacing overall, while also emphasizing that effects depend on implementation and feedback. The app's queue and prompts are evidence-informed design choices, not a claim that this specific app has been validated in a controlled trial.

Validation for this package: inline JavaScript passes `node --check`; the two HTML copies are byte-identical; no duplicate HTML IDs were found by the static scan; the ZIP passes its integrity test. Full browser end-to-end interaction testing was not performed.


## LocalStorage reliability and backup

The application is local-first. The following user-owned state is persisted in the browser's `localStorage` and survives reloads in the same browser profile and origin:

- Flashcard statuses (`known`, `unknown`, `review`) and user-created/imported cards.
- Spaced-review schedule, repetition counts, lapses, due dates and last grade.
- Flashcard recall drafts; drafts are cleared after the card is graded.
- Search text, category/status/source filters, current card, current study queue and queue position.
- Last selected navigation hub.
- Daily mission completion, daily answer drafts, Smart Review drafts, Interview Mode drafts, interview rubric scores, session history and current training session position.
- An unfinished “Add flashcard” form draft.

The “Pełny backup JSON” export now includes the flashcard deck and a snapshot of the app's known localStorage keys. Importing a full backup asks for confirmation and reloads the page to restore saved progress. Older deck-only JSON exports remain importable. Keep backups private if your notes contain personal information.

A visible storage indicator reports successful writes and storage failures. If browser storage is blocked, private browsing clears its data, quota is exceeded, or the user clears site data, persistence can still fail. The app surfaces write errors instead of silently claiming success. LocalStorage is scoped to the current origin and browser profile; it does not synchronize devices or browsers.

Technical checks for this build: JavaScript syntax (`node --check`) passes for both inline scripts; no duplicate static HTML IDs; the standalone and GitHub Pages HTML files are identical; ZIP integrity passes. A full browser end-to-end run did not complete within the test environment's timeout, so manual browser testing remains recommended after deployment.

## Learning Lab V17: pedagogika i UX/UI

### Zmiany pedagogiczne
- Dodano krótką samoocenę pewności przed odsłonięciem odpowiedzi (zgaduję / częściowo / umiem wyjaśnić). To ćwiczenie kalibracji metapoznawczej, nie ocena obiektywnej kompetencji.
- Po ocenieniu fiszki zapisywana jest lokalnie ostatnia próba, poziom pewności i samoocena. Przy kolejnej powtórce historia poprzedniej próby jest dostępna dopiero po odsłonięciu odpowiedzi, aby nie podpowiadać odpowiedzi przed próbą przypominania.
- Odpowiedzi modelowe w Daily Mission i Interview Mode ograniczają powtórzenia identycznych zdań i wyraźniej rozdzielają odpowiedź, mechanizm, przykład, zastosowanie i pułapkę.
- Pytania transferowe mają teraz priorytety domenowe: bezpieczeństwo, performance, system design/bazy danych, a następnie kod. Dzięki temu karta o wydajności nie dostaje automatycznie niepasującego zadania tylko dlatego, że zawiera snippet.
- Test transferu prosi o kontrprzykład i sprawdzenie hipotezy, nie tylko o powtórzenie definicji.

### UX/UI i dostępność
- Wyraźniejsze stany zaznaczenia samooceny, większe cele dotykowe, widoczny focus klawiatury, bardziej czytelne przyciski trybów treningowych i lepszy układ na wąskich ekranach.
- Historia próby jest rozwijana i dostępna dopiero po odsłonięciu wzorca.
- Dodano do pełnego backupu klucz `senior-flashcard-confidence-v1`. Historia prób i kalibracja pozostają w `senior-frontend-interview-training-v1`, który już jest eksportowany w kopii zapasowej.

### Research
- Carpenter, Pan & Butler (2022), *The science of effective learning with spacing and retrieval practice*, Nature Reviews Psychology: https://www.nature.com/articles/s44159-022-00089-1
- Agarwal, Nunes & Blunt (2021), *Retrieval Practice Consistently Benefits Student Learning: A Systematic Review*: https://doi.org/10.1007/s10648-021-09595-9
- Weinstein, Madan & Sumeracki (2018), *Teaching the science of learning*: https://pmc.ncbi.nlm.nih.gov/articles/PMC5780548/
- Sana & Yan (2022), *Interleaving Retrieval Practice Promotes Science Learning*: https://pubmed.ncbi.nlm.nih.gov/35436145/

Badania wspierają strategie takie jak aktywne przypominanie, rozłożenie powtórek, przykłady i przeplatanie tematów. Nie dowodzą jednak, że ten konkretny interfejs został eksperymentalnie zwalidowany. W V17 wykonano statyczne kontrole kodu i archiwum; nie wykonano pełnego testu E2E na prawdziwym urządzeniu mobilnym.


## V18 — evidence-informed learning refinements

This release builds on the V17 learning flow and adds:
- Per-card adaptive review intervals using a simple SM-2-inspired ease factor.
- Confidence calibration: when confidence is high but recall is weak, the next interval is shortened; when recall is strong despite low confidence, the interval remains conservative rather than jumping too far.
- A persisted learning-session summary with grades, duration, and overconfidence mismatches.
- A lightweight calibration panel based on the user's own recent attempts.
- An optional self-check rubric after the model answer, covering mechanism, example, trade-off/edge case, and verification.
- Clearer expected interval labels on grading buttons and responsive summary layouts.

Research basis:
- Carpenter, Pan & Butler (2022), *The science of effective learning with spacing and retrieval practice*, Nature Reviews Psychology, https://doi.org/10.1038/s44159-022-00089-1
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, Educational Psychology Review, https://doi.org/10.1007/s10648-025-10076-6
- Trumble et al. (2024), *Systematic review of distributed practice and retrieval practice in health professions education*, https://doi.org/10.1007/s10459-023-10274-3
- Bego et al. (2024), *Single-paper meta-analyses of the effects of spaced retrieval practice in nine introductory STEM courses*, https://doi.org/10.1186/s40594-024-00468-5

Interpretation note: retrieval with corrective feedback and spacing have strong support across multiple settings, but interval formulas and confidence-based adjustments in this application are engineering heuristics, not a clinically or experimentally validated algorithm. Interleaving is retained as an option; it is not assumed to benefit every concept equally.


## V19 — UX/UI refinement only

This release intentionally adds no new features and changes no storage schema or learning logic. It refines the existing interface: clearer typography and spacing, calmer card depth, consistent controls, improved keyboard focus, touch target sizing, a more readable flashcard answer, more predictable mobile filter/navigation layout, better modal sizing with safe-area padding, and reduced-motion behavior. Small copy edits clarify the learning flow and empty-filter state.

Research informing the design decisions:
- Castro-Alonso et al. (2021), *Five Strategies for Optimizing Instructional Materials*: coherence/redundancy reduction, signaling, and segmentation to reduce extraneous cognitive load. https://doi.org/10.1007/s10648-021-09606-9
- Rey et al. (2019), *A Meta-analysis of the Segmenting Effect*: learner-paced meaningful segments showed small-to-medium effects for retention and transfer across 56 investigations. https://doi.org/10.1007/s10648-018-9456-4
- Schneider et al. (2018), *A meta-analysis of how signaling affects learning with media*: signaling was associated with improved retention and transfer and reduced cognitive load across 103 studies. https://doi.org/10.1016/j.edurev.2017.11.001
- W3C, WCAG 2.2: target size and focus visibility guidance. https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

These findings inform the presentation choices; they do not prove that this specific interface has been experimentally validated.


## V20 — UX/UI refinement only (no new functionality)

This release is a visual and interaction polish pass on V19. It intentionally adds no new controls, product flows, learning mechanics, or persistence keys.

- Tightened typography hierarchy, readable line lengths, spacing, surface contrast, and consistent button/control sizing.
- Made the active navigation state clearer and removed sticky mobile navigation so it cannot obscure focused controls or consume viewport while scrolling.
- Improved mobile metric-label readability and changed compact stats to a two-column layout on narrow screens.
- Improved card answer readability, code overflow, sidebar item scanning, modal safe-area spacing, and existing Interview Training panel consistency.
- Kept existing keyboard focus visible, added scroll margins to focused elements, and respected reduced-motion preferences.
- Hides keyboard-shortcut helper text on touch-only mobile layouts because it consumes valuable space without helping touch interaction; keyboard behavior itself is unchanged.

Research basis: signaling meta-analysis (103 studies, 12,201 participants) reported benefits for retention and transfer and lower cognitive load; a meta-analysis of 56 studies supports segmenting self-paced multimedia content; WCAG 2.2 includes focus visibility/obscuration and minimum target-size criteria. These sources motivate design direction, but do not prove that this exact UI has been experimentally validated.

Sources:
- Schneider et al., *A meta-analysis of how signaling affects learning with media*, https://www.sciencedirect.com/science/article/pii/S1747938X17300581
- Mayer/CTML synthesis and segmenting discussion, https://link.springer.com/article/10.1007/s11423-022-10181-1
- W3C, *What's New in WCAG 2.2*, https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

Validation note: syntax/static checks and archive integrity are run for this package. Full browser E2E coverage is not claimed unless explicitly reported.


## V21 — focused UX/UI refinement (no feature additions)

This release refines existing visual and interaction patterns only. It does not add features, change the learning algorithm, or alter the localStorage schema. Changes include consistent spacing and surface treatments, clearer flashcard hierarchy, calmer button states, more predictable Training Lab layouts, improved mobile navigation and controls, responsive rubric rows, readable long-form/code areas, and reduced-motion/focus-visible refinements.

Research used to guide decisions:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, Educational Psychology Review. The review found the retrieval-practice advantage was conditional on corrective feedback; therefore this polish keeps the existing answer-feedback flow clear rather than adding interaction steps. https://doi.org/10.1007/s10648-025-10076-6
- *Design effects and applicable scenarios of cueing in digital learning materials: a meta-analysis* (online 2025). The meta-analysis of 38 studies reported effects of cueing on attention and learning performance, moderated by cue type and presentation. This informed clearer hierarchy and consistent visual cues, not decorative color overload. https://doi.org/10.1080/10494820.2025.2591860
- W3C, Web Content Accessibility Guidelines (WCAG) 2.2. Focus visibility, touch target usability, and responsive reflow guided control sizing and keyboard focus. https://www.w3.org/TR/WCAG22/

No claim is made that this exact UI has been experimentally validated. These are evidence-informed design decisions; real-device usability testing remains necessary.


## V22 — focused reading and viewport polish (no feature additions)

V22 is a presentation-only refinement of V21. It adds no controls, product flows, learning mechanics, or persistence keys and does not change the learning algorithm or localStorage schema.

- Corrected the flashcard face overflow behavior: long questions and answers now scroll inside the visible card rather than being clipped by a later legacy `overflow: hidden` rule.
- Removed nested scrolling from the answer content so the card face is the single scroll container.
- Reduced the forced minimum card height on short mobile viewports while retaining a usable reading area.
- Improved scanning of long answers, lists, code fragments, and existing action controls without changing their content or behavior.

Research informing the design direction:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*. Retrieval practice benefits depended on corrective feedback, reinforcing the need to keep the existing answer and feedback readable. https://doi.org/10.1007/s10648-025-10076-6
- Carpenter, Pan & Butler (2022), *The science of effective learning with spacing and retrieval practice*. https://doi.org/10.1038/s44159-022-00089-1
- W3C, WCAG 2.2 Reflow guidance: ordinary content should fit narrow viewports without forcing two-dimensional scrolling. https://www.w3.org/WAI/WCAG22/Understanding/reflow.html

These sources inform the design decisions; they do not establish that this specific interface has been experimentally validated. Static validation is reported separately, and real-device visual usability testing remains necessary.


## V23: reading comfort and mobile flow (October 2026)

This is a presentation-only refinement of existing screens. No features, learning rules, JavaScript, card content, localStorage keys, or saved-data formats were added or changed.

- Restored natural document flow for flashcards on narrow/touch screens. Long answers no longer need to be read inside a fixed-height nested scrolling panel on mobile.
- Reduced the desktop card's minimum height and tuned its viewport-based sizing so the main study surface is less likely to dominate a short screen.
- Improved long-answer scanning with a consistent reading measure, paragraph rhythm, list spacing, and safe overflow for code examples and long labels.
- Kept touch controls comfortably sized and preserved visible keyboard focus and reduced-motion behavior.

Research rationale: a 2025 systematic review and meta-analysis found a small overall advantage for retrieval practice over elaborative comparison tasks, with the benefit depending strongly on corrective feedback. This supports preserving the current answer-before-reveal and self-rating flow rather than adding more interface steps. W3C's mobile guidance also emphasizes reflow without loss of content or functionality at narrow viewport widths. These are evidence-informed interface choices, not proof that this exact platform has been experimentally validated.

Sources:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, Educational Psychology Review. https://doi.org/10.1007/s10648-025-10076-6
- W3C, *Guidance on Applying WCAG 2.2 to Mobile Applications*. https://www.w3.org/TR/wcag2mobile-22/

Validation: inline JavaScript is unchanged from V22 and checked with `node --check`; CSS parsing, duplicate HTML IDs, matching HTML copies, and ZIP integrity are checked before packaging. A headless browser screenshot is used as a smoke test where the runtime supports it; this does not replace manual testing on real devices.


## V24 — focus, state clarity and reading polish (October 2026)

V24 is a presentation-only refinement of the existing platform. It adds no features, controls, learning mechanics, JavaScript, localStorage keys, or saved-data formats.

- Strengthened keyboard focus visibility and focus scroll margins for existing controls, while keeping motion reduced for users who request it.
- Clarified the active item in the existing flashcard list and made disabled control states more predictable.
- Standardized minimum control heights and text wrapping so labels and buttons remain usable at narrow widths.
- Improved the readability of existing long-form answers, blockquotes, tables, code examples, and Interview Training feedback.
- Fixed the visual indicator for the existing local-save status so an actual save error is not presented with the same green status dot as a successful save. No storage behavior changed.

Research basis: the 2025 meta-analysis of retrieval practice found its benefit depends strongly on corrective feedback, so this release preserves the current answer-and-feedback flow and makes the feedback easier to read. A 2025 meta-analysis of prompts in digital learning found effects depend on prompt design and recommended concise prompts to limit cognitive load. W3C WCAG 2.2 guidance informed focus visibility, target sizing, and reflow decisions. These sources motivate the design direction; they do not prove that this exact interface has been experimentally validated.

Sources:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, https://doi.org/10.1007/s10648-025-10076-6
- Thomann & Deutscher (2025), *Scaffolding through prompts in digital learning: A systematic review and meta-analysis of effectiveness on learning achievement*, https://doi.org/10.1016/j.edurev.2025.100686
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, https://www.w3.org/TR/WCAG22/

Validation: JavaScript remains identical to V23; static JavaScript/CSS checks, HTML ID checks, HTML-copy parity, and archive integrity are performed before packaging. Full real-device usability testing is not claimed.


## V25 — legibility of existing feedback and self-assessment (October 2026)

V25 is a CSS-only refinement of existing components. It adds no features, prompts, learning steps, JavaScript, storage keys, or saved-data formats.

- Increased the legibility of existing helper copy, learning-insight summaries, session metrics, rubric labels, and feedback text that had been styled at 10–11px.
- Made the current rubric selection more distinct while preserving the existing `aria-pressed` state and scoring behavior.
- Improved wrapping for long session labels and source links to reduce accidental horizontal page overflow.
- Kept the existing compact layouts, but stacked the existing learning-insight metrics on very narrow screens for readable labels.

Research rationale: the 2025 meta-analysis of retrieval practice found its advantage depended strongly on corrective feedback; this release improves the readability of feedback already present. A 2025 meta-analysis of digital learning prompts recommends concise, usable prompts and notes that effects depend on design, not merely on their presence. WCAG 2.2 provides guidance on readable reflow, visible focus, and operable controls. These sources motivate evidence-informed choices; they do not prove this exact interface has been experimentally validated.

Sources:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, https://doi.org/10.1007/s10648-025-10076-6
- Thomann & Deutscher (2025), *Scaffolding through prompts in digital learning: A systematic review and meta-analysis of effectiveness on learning achievement*, https://doi.org/10.1016/j.edurev.2025.100686
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, https://www.w3.org/TR/WCAG22/

Validation: JavaScript remains identical to V24. Static JavaScript/CSS parsing, duplicate HTML ID checks, HTML-copy parity, and ZIP integrity are checked before packaging. Full real-device visual/usability testing is not claimed.


## V26 — control comfort and reading rhythm (October 2026)

V26 is a presentation-only refinement of the existing platform. No new features, prompts, learning steps, JavaScript, localStorage keys, or saved-data formats were added.

- Raised the readability of small section labels and secondary metadata so visual hierarchy does not rely on tiny text.
- Made existing navigation tabs and training controls more consistent in height and easier to tap.
- Standardized focus outlines and input borders across existing controls.
- Set existing form controls to at least 16px on narrow/touch layouts to avoid unwanted focus zoom on iOS and improve legibility.
- Improved wrapping and heading rhythm in long answers and feedback, and kept code/table overflow inside its own content surface.
- Added bottom scroll padding on mobile so the existing sticky control area is less likely to obscure the focused element.

Research basis: retrieval practice is most useful when paired with corrective feedback, so this release makes existing answer/feedback surfaces easier to read without inserting additional steps. W3C WCAG 2.2 guidance informed responsive reflow, visible focus, and target-size consistency. These sources guide the design choices but do not prove that this specific platform has been experimentally validated.

Sources:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, https://doi.org/10.1007/s10648-025-10076-6
- Thomann & Deutscher (2025), *Scaffolding through prompts in digital learning: A systematic review and meta-analysis of effectiveness on learning achievement*, https://doi.org/10.1016/j.edurev.2025.100686
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, https://www.w3.org/TR/WCAG22/

Validation planned before release: JavaScript parity with V25, JavaScript syntax, CSS parser checks, static HTML ID uniqueness, identical HTML copies, and ZIP integrity. Full real-device visual testing is not claimed.


## V27 — feedback readability and self-assessment clarity (October 2026)

V27 is a presentation-only refinement of existing study and interview-training surfaces. It adds no feature, prompt, learning step, JavaScript, storage key, or saved-data format.

- Increased the readability of existing learning-insight summaries, teach-back guidance, and training helper text that previously used small secondary typography.
- Made the existing five-criterion self-assessment easier to scan: clearer criterion labels, larger level descriptions, more distinct selected states, and consistent focus indication. Scoring and `aria-pressed` behavior are unchanged.
- Improved the legibility of long technical answers and list spacing without changing content or widening the reading column.
- Reduced the vertical burden of the existing interview-session metrics on medium mobile screens while returning to a single column on very narrow screens.
- Kept keyboard focus visible inside clipped flashcard surfaces.

Research rationale: the 2025 meta-analysis of retrieval practice found the advantage over elaborative tasks was conditional on corrective feedback, supporting the choice to improve the legibility of existing feedback rather than add more steps. A 2025 meta-analysis of digital learning prompts found effectiveness depends on prompt design and recommended concise prompts. WCAG 2.2 guidance informs visible focus, target sizing, and responsive reflow. These findings inform design choices but do not demonstrate that this particular platform has been experimentally validated.

Sources:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, https://doi.org/10.1007/s10648-025-10076-6
- Thomann & Deutscher (2025), *Scaffolding through prompts in digital learning: A systematic review and meta-analysis of effectiveness on learning achievement*, https://doi.org/10.1016/j.edurev.2025.100686
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, https://www.w3.org/TR/WCAG22/

Validation: JavaScript is unchanged from V26; static syntax and CSS parsing, duplicate static HTML IDs, HTML-copy parity, and ZIP integrity are checked before release. Browser screenshots are used as a smoke test where possible; this is not a substitute for manual testing on physical devices.


## V28 — reading hierarchy and consistent control feedback (October 2026)

V28 is a presentation-only refinement of existing study and interview-training UI. It adds no features, prompts, learning steps, JavaScript, storage keys, or saved-data formats.

- Refined paragraph measure and heading rhythm in existing model answers and training feedback, while leaving code and tables independently scrollable.
- Unified the spacing, line-height, and surface treatment of existing explanatory callouts without changing their content or meaning.
- Made keyboard focus more consistent and higher contrast across existing controls, with an inset focus ring inside flashcards to avoid clipping.
- Added subtle hover/pressed feedback only for pointer-capable devices and generalized reduced-motion support.
- Preserved existing selected states, score calculations, review behavior, localStorage data, and JSON backup format.

Research basis: the 2025 meta-analysis of retrieval practice found its advantage over elaborative tasks was conditional on corrective feedback, supporting better presentation of existing answers and feedback rather than new learning steps. A 2025 meta-analysis of digital learning prompts found that effectiveness depends on prompt design and recommended concise prompts to reduce unnecessary cognitive load. WCAG 2.2 informs focus visibility and operable controls. These sources inform the design rationale; they do not establish experimentally measured learning gains for this specific platform.

Sources:
- Gonçalves, Muniz & Jaeger (2025), *Retrieval Practice Versus Elaborative Encoding: A Systematic and Meta-analytic Review*, https://doi.org/10.1007/s10648-025-10076-6
- Thomann & Deutscher (2025), *Scaffolding through prompts in digital learning: A systematic review and meta-analysis of effectiveness on learning achievement*, https://doi.org/10.1016/j.edurev.2025.100686
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, https://www.w3.org/TR/WCAG22/

Validation for V28: JavaScript is unchanged from V27; JavaScript syntax, CSS parsing, duplicate static HTML IDs, HTML-copy parity, and ZIP integrity are checked. Automated browser loading was blocked by the runtime environment, so this release does not claim successful browser screenshot or physical-device testing.


## V29 — uproszczona nauka fiszek

- Jeden widoczny przebieg nauki: odpowiedz z pamięci → kliknij „Pokaż odpowiedź” → oceń → przejdź dalej.
- Odpowiedź podstawowa jest wyeksponowana; kontekst seniora, pułapki i szczegóły są zgrupowane w jednym rozwijanym bloku.
- Wpisywanie własnej odpowiedzi i samoocena pewności są opcjonalne, a nie obowiązkowe.
- Kliknięcie dowolnego miejsca karty nie odsłania już przypadkowo odpowiedzi; odsłanianie jest jawne.
- Istniejąca sesja ma wybór 5, 10, 20 lub 50 kart. Domyślnie pozostaje 10.
- Skrócono etykiety ocen i usunięto z głównego rzędu redundantne przyciski statusu; istniejący algorytm oceniania i powtórek pozostał bez zmian.
- Zachowano istniejące tryby, historię prób, `localStorage`, backup JSON oraz dane fiszek. Zmiany nie dodają nowego trybu nauki.

Research: aktywne przypominanie i korekcyjna informacja zwrotna wspierają utrwalanie i zastosowanie wiedzy; zob. https://doi.org/10.1016/j.learninstruc.2025.102196 oraz https://doi.org/10.1016/j.learninstruc.2025.102219.


## Flashcard filtering and link affordances (V30)

- The filter toolbar explains what each control does and announces how many cards match.
- Search covers questions, answers, examples, tags, category, source title/description, and the deeper explanation fields already stored on cards.
- “Clear filters” returns to the complete deck and is also offered when no cards match.
- Starting a study session uses only the currently filtered result set; it no longer silently discards the user's search/category/status/source selection. The session size is capped to the number of matching cards.
- Links with a valid `href` explicitly use a pointer cursor; disabled buttons retain their disabled cursor.
- No new storage schema or learning mode was added. Existing local progress, review scheduling, user cards, history and JSON backup remain in place.

Research rationale: retrieval practice works best when learners actually attempt recall before seeing the answer; the current answer-before-reveal sequence is preserved. Clear labels and visible focus support predictable operation and keyboard use (WCAG 2.2). Sources: https://doi.org/10.1016/j.learninstruc.2025.102196 and https://www.w3.org/TR/WCAG22/


## V31 UX update

- Active filters are visible as removable chips; each chip clears only its own filter.
- Search is accent-insensitive (for example, `powtorzenie` also matches `powtórzenie`).
- Search includes source IDs and handles tags whether stored as arrays or strings.
- Cursor semantics are corrected: active links use a pointer; only genuinely disabled controls show a prohibited cursor.
- No learning logic, review scheduling, or storage schema was intentionally changed.

Research rationale: retrieval practice with corrective feedback supports retention; interface changes prioritize legible filter state and predictable controls rather than extra gamification. References: https://doi.org/10.1007/s10648-025-10076-6 and https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/


## Filter and keyboard consistency (V32)

- Added visible labels to existing search, category, status, source, and session-size controls. The existing IDs and saved filter values are unchanged.
- Multi-word search now treats each word as a required term and searches across the existing combined card text. Terms may appear in different fields; accent-insensitive normalization remains enabled.
- Implemented the already-advertised keyboard grading shortcuts: after revealing an answer, keys 1–4 map to “Nie pamiętałem”, “Częściowo”, “Umiem wyjaśnić”, and “Łatwe”. Space reveals/toggles the answer, arrows navigate. Keyboard shortcuts are ignored while editing form fields or while a modal is open. Repeated keydown events cannot grade multiple cards accidentally.
- Removed the misleading hint that 1–3 set card status before reveal; that behavior was not implemented and there are no matching visible controls.
- No new study modes, storage keys, or learning algorithms were added.

Research basis: retrieval practice paired with answer feedback supports retention; the UI should make answer reveal and grading predictable. See Aljabri (2024), a randomized study of 177 learners in which both immediate and delayed feedback outperformed no-feedback/testing and restudy conditions, with immediate feedback showing the strongest long-term retention in that study: https://doi.org/10.1057/s41599-024-03983-6. W3C recommends properly associated labels for form controls: https://www.w3.org/WAI/tutorials/forms/labels/.


## Simpler flashcard controls (V33)

- Added “Wszystkie pasujące” to the existing session-size selector. The session queue already supports the `all` value, but the interface did not expose it. It selects all cards matching the current filters; no new study mode or scheduling logic was introduced.
- Simplified the on-card instructions into one short reminder, reducing vertical space before the question.
- Simplified the filter introduction and aligned the visible category labels across the selector and active-filter chips.
- Corrected the category selector's default option label, which was being reset to “Wszystkie typy” after the deck was populated.
- Rebalanced the existing filter controls into a clearer desktop grid and retained two-column/mobile stacking for narrow screens.
- No changes to the learning algorithm, review intervals, storage schema, or card content.

Research rationale: retrieval practice benefits are conditional in part on feedback availability, so the UI should keep the answer-reveal and self-rating path prominent while reducing extraneous UI instructions. See Gonçalves, Muniz & Jaeger (2025), meta-analysis of 44 studies: https://doi.org/10.1007/s10648-025-10076-6. Baymard's search UX research discusses clear filter naming and no-result guidance: https://baymard.com/research/ecommerce-search.


## Flashcard simplification V34

- Removed repeated instruction banners from the front and answer sides; the global keyboard hint and the existing reveal/rating controls remain.
- Renamed the answer heading to the neutral **Odpowiedź** so it does not promise that every source answer is short.
- Short examples stay visible. Long code/examples (over 260 characters or six lines) are collapsed behind a clear disclosure and remain fully available.
- No card content, review intervals, grading values, storage keys/schema, filters, backup format, or interview-training behavior was intentionally changed.

This follows a simple learning path: retrieve from memory, reveal the reference answer, inspect a longer example only when useful, then self-rate. Retrieval practice benefits from explanatory feedback; the goal here is to reduce repeated interface instructions, not remove the explanation itself. See: https://pubmed.ncbi.nlm.nih.gov/30998028/ and https://www.retrievalpractice.org/strategies/2018/5/25/feedback

## V35 — naprawa filtrów i sesji fiszek
- Naprawiono konflikt nazwy `source` między funkcją pomocniczą a elementem HTML o `id="source"`, który powodował pustą listę źródeł i filtrowanie do zera kart.
- Wypełnianie listy źródeł korzysta teraz z jawnego selektora DOM; metadane źródła pobiera `getSourceInfo`.
- Filtr kategorii obsługuje wiele zaznaczonych kategorii; poprzedni zapis pojedynczej kategorii jest nadal odczytywany.
- Zachowano schemat danych fiszek, algorytm powtórek, klucze postępu, backup JSON i strukturę GitHub Pages.


## V36 UX polish
- Fiszki: przycisk sesji pokazuje liczbę kart wynikającą z bieżących filtrów i wyboru rozmiaru; akcje są wyłączone, gdy filtr nie zwraca wyników.
- Losowanie wybiera inną kartę, jeśli dostępna jest więcej niż jedna, i daje krótką informację o pozycji w wynikach.
- Etykieta kategorii pokazuje liczbę zaznaczonych kategorii; podpowiedź wyboru wielu kategorii jest prostsza.
- Nie zmieniono formatu danych fiszek ani algorytmu powtórek.

## V37 · czytelniejsze filtry
- Liczba fiszek jest widoczna przy każdej kategorii i źródle, dzięki czemu łatwiej ocenić, co wybór filtra da przed uruchomieniem nauki.
- „Wszystkie źródła” pokazuje łączną liczbę kart; puste źródła są jawnie oznaczone zerem.
- Tooltipy filtrów wyjaśniają liczby oraz obsługę wielokrotnego wyboru kategorii.
- Komunikat pustych wyników jest krótszy i mówi wprost, co zrobić dalej.
- Nie zmieniono algorytmu powtórek, formatu danych fiszek, kluczy localStorage ani formatu backupu JSON.


## V38 · uproszczenie czytania fiszek

- Ograniczono sztucznie wysoką minimalną wysokość karty, dzięki czemu krótsze pytania i odpowiedzi nie zostawiają dużej pustej przestrzeni.
- Wzmocniono wizualną hierarchię odpowiedzi głównej, zachowując dodatkowe wyjaśnienia w sekcji rozwijanej.
- Uproszczono etykiety i instrukcję pod kartą; zachowano treść edukacyjną, algorytm powtórek, statusy, historię, localStorage, import/eksport JSON oraz konfigurację GitHub Pages.
- Dodano obsługę preferencji ograniczenia animacji.

## V39 — prostszy mechanizm fiszek

- Zastąpiono niewygodny natywny wybór wielu kategorii wyszukiwanym menu z checkboxami. Nie trzeba pamiętać o Ctrl/Command.
- Zaznaczanie kategorii natychmiast aktualizuje wyniki; menu pokazuje liczbę fiszek przypisanych do kategorii, ma „Zaznacz wszystkie”, „Wyczyść” i „Gotowe”.
- Menu kategorii zamyka się kliknięciem poza nim lub klawiszem Escape, a na telefonie otwiera się jako dolny panel.
- Skrócono podpowiedź przy fiszce do jednej sekwencji: odpowiedz z pamięci → pokaż odpowiedź → oceń uczciwie.
- Zachowano dotychczasowe pole `category` w ustawieniach UI, strukturę fiszek, algorytm powtórek, statusy, historię, localStorage, backup JSON i GitHub Pages.


## V40 UX polish
- Uproszczono nazwy akcji w selektorze kategorii, żeby odróżnić pokazanie wszystkich kart od wyczyszczenia zaznaczenia.
- Dopracowano układ przycisków odpowiedzi i ocen na małych ekranach; główna akcja „Pokaż odpowiedź” jest wyraźniejsza.
- Dodano widoczne stany fokusu dla klawiatury i ograniczenie animacji zgodne z preferencją systemową.
- Nie zmieniano algorytmu powtórek, danych fiszek ani schematu localStorage.


## V41 — uproszczony rytm fiszki

- Skrócono etykiety i teksty w opcjonalnej notatce, żeby nie konkurowały z pytaniem.
- Zmieniono nazwy samooceny na krótsze i bardziej bezpośrednie.
- Uporządkowano wizualnie notatkę, wybór pewności i dodatkowe wyjaśnienia, szczególnie na małych ekranach.
- Bez zmian w schemacie danych, algorytmie powtórek, zapisie lokalnym, historii i formacie kopii JSON.


## V43 — uproszczona odpowiedź na fiszce
- Wyraźnie oddzielono główną odpowiedź od opcjonalnego rozwinięcia.
- Usunięto powtarzającą się listę kontrolną; pozostawiono pojedynczy prompt sprawdzający zrozumienie.
- Puste pola dodatkowe nie generują ogólnych, powtarzalnych placeholderów udających wiedzę przypisaną do konkretnej fiszki.
- Zachowano strukturę danych, mechanizm powtórek i zapis lokalny.


## V44 – prostsza praca z fiszkami
- Szybkie oznaczenie wszystkich aktualnie pasujących fiszek jako znane lub nieznane (z potwierdzeniem).
- Paginowana lista pytań i odpowiedzi; w każdej karcie można podejrzeć odpowiedź i zmienić status pojedynczej fiszki.
- Lista działa na aktualnych filtrach i nie wymaga uruchamiania sesji nauki.
- Zachowano istniejący schemat danych i algorytm powtórek.


## V45 – prostszy przegląd fiszek

- Dodano „Pokaż odpowiedzi na stronie” i „Ukryj odpowiedzi na stronie” w przeglądzie fiszek.
- Dodano podsumowanie statusów znane / nieznane / do nauki dla aktualnie filtrowanego zestawu.
- Zachowano istniejący algorytm powtórek, dane, zapis lokalny, backup JSON i workflow GitHub Pages.


## V46 · Uproszczone oznaczanie statusów

- Dodano masową akcję „Oznacz pasujące jako do nauki”, obok znanych i nieznanych.
- Ujednolicono etykiety statusów w przeglądzie fiszek: „Znam”, „Nie znam”, „Do nauki”.
- Poprawiono minimalny rozmiar przycisków statusu i widoczność fokusu klawiatury.
- Bez zmian schematu statusów, algorytmu powtórek, danych fiszek, historii, localStorage i kopii JSON.
