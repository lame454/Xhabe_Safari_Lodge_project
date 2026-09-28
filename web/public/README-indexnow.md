# IndexNow key file

`4283eaf73ea1b75d0cd033ccafd9a706.txt` is an IndexNow ownership key. It must stay
at the site root, contain exactly the key and nothing else, and keep its filename.

It is **not** a secret. IndexNow works by publishing the key at a public URL, so
anyone can read it; it proves only that whoever submits URLs also controls this
site. Do not rotate it out of caution. Rotating it means updating the filename,
the contents and `INDEXNOW_KEY` together, and anything less breaks submission
silently.

Submit URLs with `npm run indexnow` from `web/`.
