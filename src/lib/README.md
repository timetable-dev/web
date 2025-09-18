# Library explanation

`Layout` folder contains four main components: `Content` and `Header`.

`Content` renders three things:
- Welcome screen if no entity is selected (initial screen that user sees);
- Days (Monday, Tuesday and so on) and their lessons for a selected entity along with week picker;
- Error block in case API request fails.

`Header` component, I think, is self explanatory: it allows selecting already opened Entity or opening a new one in `Entity modal`.

---

`Modals` folder contains all the components that are rendered as modals (dialogs?, popup windows?) along with their children components. Some of them can be opened from different places in the app so it's better to keep them in `$lib`. There are three modals in total:

- `Entity modal` is used to open timetable of a group or teacher and save it to the local storage;
- `About app modal` contains some useful info, warning about this app being unofficial and email address;
- `Changelog modal` (what's new) containing release note for the current major or minor version.

---

`Remote` folder contains experimental Svelte remote actions used as a replacement of API routes for component-level data loading.

---

File `types.ts` contains global types used all around this app.

File `persisted.ts` exports a Persisted Store from Runed library used as a convenient way of storing opened entities in Local Storage.