# CV landing page

Static, mobile-first professional profile for deployment from the `cv-site` directory.

## Deploy on Vercel

1. Import the `momu451/mustafa-omer` repository.
2. Set the **Root Directory** to `cv-site`.
3. Keep the framework preset as **Other**.
4. No build command is required.
5. Output directory should be `.`

## Privacy controls

- `meta` robots: `noindex, nofollow, noarchive, nosnippet`
- `robots.txt`: disallow all
- `X-Robots-Tag` via `vercel.json`
- restrictive security headers via `vercel.json`

## Notes

- Built to avoid publishing phone number, email address or home address.
- Uses semantic HTML and lightweight CSS only.
- No external fonts, scripts or trackers.
