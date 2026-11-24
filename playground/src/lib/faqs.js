// Answer-first FAQs: rendered on-page AND emitted as FAQPage JSON-LD (AEO). Keep answers factual and self-contained.
const lic = [
  ['Can I use free assets in a commercial project?', 'Only if the asset’s license says so. Every listing shows a license summary before you download. Free License assets allow personal use and monetised streams with attribution; CC0 assets allow any use; Standard and Extended licenses cover commercial work as described on the asset page.'],
  ['What file formats are included?', 'Each asset lists exactly the formats it ships with (for example PSD, SVG, PNG, FBX or WAV). PLAYGROUND never lists a format or software compatibility that the download does not actually contain.'],
]
export const faqData = {
  home: [
    ['What is PLAYGROUND?', 'PLAYGROUND is a gaming creative marketplace where gamers, streamers, esports teams, designers and game developers discover assets, customise templates in a browser editor, use free gaming tools and share their work.'],
    ['Is PLAYGROUND free to use?', 'Yes. Browsing, free downloads, the gaming tools and basic Studio exports are free. Premium assets are bought one-off, and an optional Pro plan is planned for extra editor features.'],
    ...lic,
    ['Can I make a stream overlay or banner without Photoshop?', 'Yes. The Customization Studio edits text, shapes and images in your browser and exports PNG or JPG, with a transparent-background option for PNG.'],
  ],
  explore: lic,
  asset: lic,
  esports: [
    ['What is included in an esports team kit?', 'Kits can include team logo systems, secondary marks, colour palettes, jersey and hoodie mockups, roster and player cards, matchday posters, result and MVP cards, bracket graphics and social media templates. Each listing states exactly what is included.'],
    ['Are esports kits editable?', 'Editable formats such as PSD, AI or SVG are shown on each kit’s page. Only formats actually supplied are listed.'],
  ],
  studio: [
    ['What can I export from the Studio?', 'PNG and JPG at the exact canvas size shown in the editor, with an optional transparent background for PNG. Projects can be saved to your account and edited later.'],
    ['Do I need to install anything?', 'No. The editor runs in your browser, including on tablets and phones, and keyboard shortcuts such as undo (Ctrl+Z) work on desktop.'],
  ],
  tools: {
    crosshair: [['How do I use a custom crosshair in CS2?', 'Adjust the sliders, press “Copy console commands”, open the CS2 console and paste the commands. Other games use their own crosshair editors; use the preview values as a guide.']],
    sensitivity: [['How is sensitivity converted between games?', 'By matching cm/360°, the physical mouse distance for a full turn, using each game’s yaw value and your DPI. It converts hipfire only; scoped sensitivity is not converted.'], ['Why does my converted sensitivity feel slightly off?', 'Games round sensitivity and some apply acceleration or field-of-view scaling. Treat the result as a starting point and fine-tune in-game.']],
    'name-generator': [['Are generated gamertags available?', 'Not guaranteed. Names are generated randomly and not checked against any platform, so search the platform before you commit.']],
    fps: [['How many FPS do I need?', 'Ideally at least your monitor’s refresh rate, for example 144 FPS on a 144 Hz display. This tool converts FPS to frame time (1000 ÷ FPS) and shows the uplift needed to reach a target. It does not predict FPS for specific hardware.']],
    'pc-builder': [['Does the PC planner check every compatibility issue?', 'It checks CPU socket, memory type, PSU headroom and GPU length. Prices are sample estimates, so verify parts with the manufacturer before buying.']],
    palette: [['How do I export a colour palette?', 'Generate a palette, lock the colours you like, then copy HEX values, CSS variables or JSON. Press Space to generate a new palette.']],
    resolution: [['How do I find an aspect ratio?', 'Divide width and height by their greatest common divisor. For example 2560×1440 reduces to 16:9. The calculator also scales dimensions to a new width while keeping the ratio.']],
    'setup-planner': [['How wide is a 27-inch 16:9 monitor?', 'About 60 cm. The desk-fit calculator multiplies monitor width by the number of screens to check they fit your desk.']],
  },
}
export const faqsFor = (path) => {
  if (path === '/') return faqData.home
  if (path === '/assets/esports-kits') return [...faqData.esports, ...faqData.explore]
  if (path.startsWith('/asset/')) return faqData.asset
  if (path.startsWith('/assets/') || ['/explore', '/free', '/premium', '/trending'].includes(path)) return faqData.explore
  if (path.startsWith('/tools/')) return faqData.tools[path.split('/')[2]] || []
  if (path === '/create' || path.startsWith('/studio/')) return faqData.studio
  return []
}
