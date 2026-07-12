# QRHype QA Checklist

This checklist covers the full feature surface. Items marked Verified are
covered by the automated payload and validation suite (`npm run test:payloads`)
or by the type-checked production build (`npm run build`). Items marked Manual
should be confirmed on real devices before a public release, since scanning and
platform behavior cannot be fully validated in a headless build.

Run the automated checks first:

```bash
npm run test:payloads   # 35 payload, escaping, and validation assertions
npm run build           # strict TypeScript type-check plus production build
```

## Code types and payloads

- [Verified] Website URL prepends https when no scheme is present and preserves
  an existing scheme.
- [Verified] Custom URL schemes (for example `myapp://`) pass through unchanged.
- [Verified] Plain text encodes exactly as entered.
- [Verified] Email builds a `mailto:` link with URL-encoded subject and body.
- [Verified] Phone builds a `tel:` link with a sanitized number.
- [Verified] SMS builds an `SMSTO:number:message` payload.
- [Verified] Wi-Fi builds a `WIFI:` payload and escapes the special characters
  `\ ; , : "` in the SSID and password.
- [Verified] Wi-Fi omits the password field when security is set to None.
- [Verified] Wi-Fi adds the hidden network flag when enabled.
- [Verified] vCard produces a valid version 3.0 card with escaped fields.
- [Verified] WhatsApp builds a `wa.me` link with digits only and an encoded
  message.
- [Verified] Location builds a `geo:` URI for coordinates and a maps search URL
  for an address.
- [Verified] Calendar event builds a VEVENT with correctly formatted start and
  end timestamps.
- [Manual] App store or deep link opens the intended listing or app on device.
- [Verified] Social profile strips a leading @ and builds the platform URL, and
  passes a full URL through unchanged.
- [Verified] Custom raw payload encodes the exact string entered.

## Validation and gating

- [Verified] Empty required fields produce a blocking error.
- [Verified] Invalid email addresses are rejected.
- [Verified] Latitude and longitude are range-checked.
- [Verified] A calendar end time earlier than the start time is rejected.
- [Verified] Download is blocked while any validation error is present.
- [Manual] Every field-level error message reads clearly and points to the fix.

## Styling controls

- [Manual] Foreground solid color updates the live preview.
- [Manual] Gradient fill with adjustable angle renders as expected.
- [Manual] Background color and the transparent background toggle behave
  correctly, including the checkerboard behind a transparent code.
- [Manual] All six module styles render (square, rounded, dots, classy, classy
  rounded, extra rounded).
- [Manual] Corner frame and corner center styles and colors apply.
- [Manual] Size and quiet zone sliders change the rendered output.
- [Manual] Error correction level selection applies.
- [Manual] Style presets apply a complete, coherent look.
- [Manual] Reset returns all style controls to their defaults.

## Logo handling

- [Manual] Uploading a PNG, JPG, SVG, or WebP places a centered logo.
- [Verified] Uploading a logo sets error correction to High automatically.
- [Manual] The white backdrop toggle draws a clean circular background.
- [Manual] Logo size and padding sliders behave and warn when the logo grows
  large enough to threaten scanability.
- [Manual] Removing the logo clears it from the preview.
- [Manual] Files over 4 MB are rejected with a clear message.

## Scanability guidance

- [Verified] Contrast is evaluated using WCAG relative luminance.
- [Manual] Low contrast, inverted colors, oversized logo, tight quiet zone, and
  dense data each surface the correct advisory.
- [Manual] A failing check disables download until resolved.

## Downloads

- [Manual] PNG download opens and displays correctly.
- [Manual] SVG download is a valid vector file.
- [Manual] PDF download opens with the code centered on the page.
- [Manual] JPG download flattens a transparent background onto white.
- [Manual] The downloaded filename follows `qrhype-[type]-[date].[ext]`.

## Scanning (device testing)

- [Manual] Each generated code scans on iOS Camera.
- [Manual] Each generated code scans on Android Camera or Google Lens.
- [Manual] Codes with a logo at the default size still scan reliably.
- [Manual] Printed codes scan at a reasonable physical size.

## Accessibility

- [Manual] All inputs have associated labels.
- [Manual] The full flow is operable by keyboard alone.
- [Manual] Focus is visible on every interactive element.
- [Verified] Errors are conveyed with text and icons, not color alone.
- [Manual] Dialogs trap focus, close on Escape, and restore focus on close.
- [Manual] A screen reader announces the sample preview state and toasts.

## Responsive layout

- [Manual] Mobile layout stacks cleanly with the preview as step 3.
- [Manual] The floating View code button appears on mobile once a code is ready.
- [Manual] Desktop shows a sticky preview beside the form.

## PWA and offline

- [Manual] The app installs to the home screen or desktop.
- [Manual] After one load, the app opens and works with no network.
- [Manual] A new deployment updates the installed app on next launch.

## Deployment

- [Verified] The production build emits assets with relative paths for GitHub
  Pages subpath hosting.
- [Manual] The deployed site loads correctly from its GitHub Pages URL.
