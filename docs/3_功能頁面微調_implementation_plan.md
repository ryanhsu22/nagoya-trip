# Implementation Plan: Feature Pages Fine-Tuning (Round 5)

This round focuses on fixing the MAP button in the Hotel page, improving the Header map icon's visual state, and ensuring UI consistency on the Baby page.

## Proposed Changes

### [CSS] [style.css](file:///D:/AntiWorkspace/nagoya-trip/css/style.css)

- Add `.btn-icon.active` class to provide a persistent background color (e.g., `#EFE7DE`) for the map toggle.
- Update `.situation-item` padding from `var(--spacing-md)` to `var(--spacing-sm)` to match the Daily Routine card.
- Ensure `.shop-header` and `.shop-feature` use consistent margins and top alignment.

### [JS] [app.js](file:///D:/AntiWorkspace/nagoya-trip/js/app.js)

- Update `initMapControls` to toggle the `active` class on `mapToggleBtn` when the map is shown/hidden.
- Ensure the `active` class is removed when the map is closed via `mapCloseBtn`.

### [JS] [pages.js](file:///D:/AntiWorkspace/nagoya-trip/js/pages.js)

- Refactor `showHotelOnMap()` to call `showEventOnMap('d1-e2')`. This ensures the map focuses on the actual itinerary event marker for the hotel instead of creating a generic marker.
- Fine-tune baby shop item rendering for better alignment.

## Verification Plan

### Manual Verification
- **Hotel Map**: Click "MAP" button in Hotel Info page. Verify it opens the map, switches to Day 1, and highlights the "Hotel Check-in" marker.
- **Header Icon**: Click the map toggle in the header. Verify the icon gains a background color when map is open and loses it when map is closed.
- **Baby Page UI**: Compare "Crying Suggestions" height with "Daily Routine". Verify they match. Check shop item spacing and top alignment.
