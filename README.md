# compare-iphone-models

Scrape JSON formatted list data from https://www.apple.com/iphone/compare/ for programmatic comparisons

> Updated 2020/10/14
>
> It'll need to be updated again if Apple changes the HTML structure of the page.

**PRs welcome.**

# Files

  - `save-data.ts`

    [Deno](https://github.com/denoland/deno) script for

      - downloading the HTML of the compare page, or
      - parsing JSON data from stdin

    and saving the result locally to `./data`

  - `scrape.js`

    Userscript for scraping the data on the comparison website

# Use

1. Navigate to https://www.apple.com/iphone/compare/ or to the cached html file in `./data/apple-iphone-compare-cached_<TIMESTAMP>.html`. You can cache a new one with:

```shell
deno run --allow-net --allow-read=. --allow-write=. save-data.ts download
```

2. Copy the contents of `scrape.user.js` and then paste and run it in your browser's JS console.

3. Copy the console logged JSON string (60+ kB) to your clipboard.

4. Save it however you want, or piping from your CLI clipboard utility to the Deno script:

  - Linux: `xclip`
  - macOS: `pbpaste`
  - Windows (My best guess for Powershell, but not sure 🤷‍♂️): `Get-Clipboard`

Example:
```shell
pbpaste | deno run --allow-net --allow-read=. --allow-write=. save-data.ts stdin
```
5. Analyze the JSON data file.
