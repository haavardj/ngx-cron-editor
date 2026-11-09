# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`ngx-cron-editor`: an Angular Material component for building cron expressions graphically, used as a reactive-forms control (`ControlValueAccessor`). Published to npm. Supports `standard` (5-field) and `quartz` (6–7 field, with seconds and year) cron flavors via `CronOptions.cronFlavor`.

Angular CLI workspace with two projects (see `angular.json`):

- `ngx-cron-editor`: the library, in `libs/ngx-cron-editor/` (built with ng-packagr, entry `public_api.ts`).
- `demo`: demo app in `apps/demo/`, deployed to GitHub Pages.

Angular 22 (Material 22, TypeScript 6). The library's peer range is `>=22 <23`; older Angular versions stay on 0.10.x. Bumping Angular means bumping the peer range in `libs/ngx-cron-editor/package.json` too. Node version: 24 (`.node-version`).

`tsconfig.json` sets `"strict": false` explicitly: TypeScript 6 enables strict mode by default and the code is not strict-clean.

## Commands

```sh
ng build ngx-cron-editor                # build library to dist/libs/ngx-cron-editor
npm run build:lib                       # production library build + copy README.md/LICENSE.md into dist (use for publishing)
npm run pack:lib                        # build:lib, then npm pack the dist folder
ng serve demo                           # run demo app
ng test ngx-cron-editor                 # Karma/Jasmine tests for the library
ng test demo
ng lint ngx-cron-editor                 # ESLint (flat config per project); not clean, see below
ng extract-i18n demo                    # update apps/demo/src/locale/*.xlf
ng deploy demo                          # publish demo to GitHub Pages (angular-cli-ghpages)
```

Run a single spec file: `ng test ngx-cron-editor --include libs/ngx-cron-editor/src/cron-editor.component.spec.ts`. Focus a single test with `fdescribe`/`fit`.

**The demo imports the library from `dist/`**, not from source: `tsconfig.json` maps `ngx-cron-editor` to `./dist/libs/ngx-cron-editor`. Build the library before serving, building or testing the demo, and rebuild it after library changes.

## Architecture

Nearly all logic lives in `libs/ngx-cron-editor/src/cron-editor.component.ts` (`CronGenComponent`, selector `cron-editor`) and its template `cron-editor.template.html`. `TimePickerComponent` (`cron-time-picker.*`) is a sub-control for hour/minute/second/AM-PM. `CronEditorModule` is an NgModule that declares and exports both; the components are `standalone: false` and use `ChangeDetectionStrategy.Eager` (set by the Angular 19 and 22 migrations to keep pre-upgrade behavior). Templates use `@if`/`@for` control flow.

Known lint debt: angular-eslint 22's recommended rules flag the NgModule/non-standalone setup, constructor injection, missing OnPush, and some template accessibility issues.

Data flow:

- **Cron → UI** (`writeValue` → `handleModelChange`): an expression with the wrong segment count for the active flavor is not parsed: it goes to the Advanced tab's input, and `validate()` (the component is also an `NG_VALIDATORS` provider) reports `cronSegments` on the control; `ngDoCheck` revalidates when `options.cronFlavor` changes, including in-place mutation. A valid expression is normalized to the quartz layout (standard 5-field input gets `0 … *` added), split into tokens, and written into the single `allForm` FormGroup. The cron type (`minutely`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, or `unknown` = Advanced tab) is chosen by matching the normalized string against the regexes at the top of the file. Most `setValue` calls use `{emitEvent: false}` to avoid echoing the value back.
- **UI → cron**: `allForm.valueChanges` (debounced 50 ms) calls `computeCron()`, which dispatches on `cronType` to a `compute*Cron()` method and passes the result to `onChange`. `computeCron()` also sets `tabIndex`; the subscription then calls `markForCheck()`, because the change happens outside change detection and Angular 22 parents are OnPush by default. Test hosts without a `changeDetection` setting are OnPush too.
- **Tabs**: `onTabChange` maps the selected `MatTab` (via `@ViewChild` refs) to a `cronType`. Tabs can be hidden through `CronOptions.hide*Tab`, so tab indices are never hard-coded; look them up in the `tabs` QueryList.

Flavor differences are centralized in the getters `isCronFlavorQuartz`, `yearDefaultChar`, `weekDayDefaultChar` and `monthDayDefaultChar` (quartz uses `?` for the unused day field).

`enums.ts` holds day, month-week and month labels; user-facing strings use `$localize`. Norwegian (`nb`) translation files exist for library and demo, but they use legacy SHA-1 message IDs while `enableI18nLegacyMessageIdFormat` is `false`, so the `nb` build reports missing translations. `extract-i18n` only works for the demo (library projects are unsupported), and re-extracting drops the legacy entries.

Theming: there is no theme mixin. The editor is built from Material components, which follow the app's theme through Material 22's `--mat-sys-*` CSS variables. If the editor's own stylesheet ever needs colors, use those variables (e.g. `var(--mat-sys-on-surface)`) rather than a Sass mixin taking a theme map.

Documentation: the root `README.md` is the only README. It is what GitHub shows, and `build:lib` copies it (and `LICENSE.md`) into the npm package, because ng-packagr refuses assets outside the library folder.

## Releases

Conventional Commits (`feat:`, `fix:`, `chore:`, scoped like `feat(editor):`). `.versionrc.json` configures standard-version / commit-and-tag-version to bump the version in `package.json`, `package-lock.json` and `libs/ngx-cron-editor/package.json` and produce `chore(release): x.y.z` commits and `CHANGELOG.md` entries. The library's peer-dependency range on Angular lives in `libs/ngx-cron-editor/package.json`.
