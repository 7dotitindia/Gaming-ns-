// ALL CONTENT BELOW IS SAMPLE / DEMO DATA. Replace with CMS / database (see brief §14).
export const categories = [
  { slug: 'game-ui', name: 'Game UI', icon: 'Layout', art: 'hud', blurb: 'HUDs, menus, buttons and inventory screens for shipped-quality interfaces.' },
  { slug: '3d', name: '3D Assets', icon: 'Box', art: 'lowpoly', blurb: 'Characters, weapons, props and environments ready for Unity, Unreal and Blender.' },
  { slug: '2d', name: '2D Assets', icon: 'Shapes', art: 'sprite', blurb: 'Sprites, backgrounds and illustrations for 2D games and key art.' },
  { slug: 'streaming', name: 'Streaming', icon: 'Clapperboard', art: 'stream', blurb: 'OBS overlays, alerts, transitions and emotes for your channel.' },
  { slug: 'audio', name: 'Audio', icon: 'Music', art: 'audio', blurb: 'SFX, loops and music with clearly stated usage rights.' },
  { slug: 'graphics', name: 'Graphics', icon: 'Sparkles', art: 'poster', blurb: 'Posters, banners and thumbnails ready to customize.' },
  { slug: 'typography', name: 'Typography', icon: 'Type', art: 'type', blurb: 'Display and UI typefaces with game-friendly licensing.' },
  { slug: 'animation', name: 'Animation', icon: 'Play', art: 'anim', blurb: 'Rigs, loops, transitions and motion packs.' },
  { slug: 'wallpapers', name: 'Wallpapers', icon: 'Image', art: 'wall', blurb: 'Desktop and mobile wallpapers in 4K and ultrawide.' },
  { slug: 'esports-kits', name: 'Esports Team Kits', icon: 'Trophy', art: 'jersey', blurb: 'Team identity systems, jerseys, roster cards, matchday posters and social packs.' },
]

export const creators = [
  { username: 'northframe', name: 'Northframe Studio', bio: 'Interface designers focused on game HUD systems and menus. Sample creator profile.', followers: 4210, region: 'Berlin, DE' },
  { username: 'vexel', name: 'Vexel', bio: 'Low-poly environment artist. Sample creator profile.', followers: 2890, region: 'Pune, IN' },
  { username: 'ashenpixel', name: 'Ashen Pixel', bio: 'Stream overlays and brand kits for creators and teams. Sample creator profile.', followers: 6120, region: 'Toronto, CA' },
  { username: 'kitforge', name: 'KitForge', bio: 'Esports identity and matchday systems. Sample creator profile.', followers: 3540, region: 'Seoul, KR' },
  { username: 'monoline', name: 'Monoline', bio: 'Typography and poster design. Sample creator profile.', followers: 1730, region: 'Lisbon, PT' },
  { username: 'driftaudio', name: 'Drift Audio', bio: 'Game audio — SFX and loops. Sample creator profile.', followers: 980, region: 'Austin, US' },
]

const L = {
  std: 'PLAYGROUND Standard License — personal and commercial use in your own projects/streams. Redistribution or resale of source files not permitted.',
  free: 'PLAYGROUND Free License — personal use and monetised streams. Attribution required. No resale or redistribution.',
  ext: 'PLAYGROUND Extended License — commercial use in shipped games and products. No resale of source files as assets.',
  cc0: 'CC0 1.0 — public domain dedication. Commercial use permitted, no attribution required.',
}

export const assets = [
  { slug: 'futuristic-hud-kit', img: '/images/hud.jpg', title: 'Futuristic HUD Kit', cat: 'game-ui', creator: 'northframe', price: 0, rating: 4.8, reviews: 312, downloads: 12400, art: 'hud', seed: 3, formats: ['PNG', 'SVG', 'Figma'], compat: ['Unity', 'Unreal', 'Godot'], dims: '1920 × 1080', size: '84 MB', license: L.free, tags: ['HUD', 'sci-fi', 'minimal'], desc: 'A modular HUD system with health, ammo, radar, objective trackers and menu panels. Built on a 8px grid with light and dark variants.', included: ['120 HUD components (SVG + PNG)', 'Figma source with auto-layout', '3 colour themes', 'Font list and usage notes'], trending: true },
  { slug: 'esports-stream-pack', img: '/images/stream.jpg', title: 'Esports Stream Pack', cat: 'streaming', creator: 'ashenpixel', price: 24, rating: 4.9, reviews: 208, downloads: 8100, art: 'stream', seed: 7, formats: ['PNG', 'PSD', 'WebM'], compat: ['OBS', 'Streamlabs', 'Photoshop'], dims: '1920 × 1080', size: '212 MB', license: L.std, tags: ['overlay', 'alerts', 'orange'], desc: 'Complete channel package: starting soon, BRB and ending scenes, webcam frame, lower thirds, panels and 12 animated alerts.', included: ['5 scene overlays (PNG + WebM)', 'Webcam frame (PSD editable)', '12 animated alerts', 'Twitch panels set'], trending: true },
  { slug: 'low-poly-world', img: '/images/lowpoly.jpg', title: 'Low Poly World', cat: '3d', creator: 'vexel', price: 39, rating: 4.8, reviews: 156, downloads: 6300, art: 'lowpoly', seed: 5, formats: ['FBX', 'Blend', 'PNG'], compat: ['Unity', 'Unreal', 'Blender'], dims: 'Scene scale 1u = 1m', size: '640 MB', license: L.ext, tags: ['environment', 'stylized', 'props'], desc: 'A stylized environment kit with 140 modular props, terrain tiles and foliage. Uses a single shared 512px palette texture for performance.', included: ['140 prefabs (FBX)', 'Blender source scenes', 'Palette texture + materials', 'Demo scene'], trending: true },
  { slug: 'gamer-identity-pack', img: '/images/identity.jpg', title: 'Gamer Identity Pack', cat: 'graphics', creator: 'monoline', price: 0, rating: 4.7, reviews: 244, downloads: 10200, art: 'hood', seed: 2, formats: ['PNG', 'PSD'], compat: ['Photoshop', 'Photopea'], dims: '2048 × 2048', size: '96 MB', license: L.free, tags: ['avatar', 'profile', 'banner'], desc: 'Profile pictures, banner templates and badges for building a consistent gamer identity across platforms.', included: ['12 avatar templates (PSD)', '6 banner templates', 'Badge set (PNG)', 'Font list'], trending: true },
  { slug: 'matchday-social-kit', img: '/images/arena.jpg', title: 'Matchday Social Kit', cat: 'esports-kits', creator: 'kitforge', price: 29, rating: 4.8, reviews: 91, downloads: 2400, art: 'jersey', seed: 4, formats: ['PSD', 'SVG', 'PNG'], compat: ['Photoshop', 'Photopea', 'Figma import (SVG)'], dims: '1080 × 1350 / 1080 × 1920 / 1500 × 500', size: '188 MB', license: L.std, tags: ['matchday', 'social', 'roster'], desc: 'Matchday poster, result card, MVP card and roster announcement in feed, story and header formats.', included: ['Matchday poster (4:5)', 'Result card + MVP card', 'Roster announcement (story)', 'X/Discord header set'], kit: true },
  { slug: 'fps-stream-starter-pack', img: '/images/fps.jpg', title: 'FPS Stream Starter Pack', cat: 'streaming', creator: 'ashenpixel', price: 0, rating: 4.6, reviews: 178, downloads: 7300, art: 'stream', seed: 11, formats: ['PNG', 'OBS Scene JSON'], compat: ['OBS'], dims: '1920 × 1080', size: '58 MB', license: L.free, tags: ['fps', 'starter', 'overlay'], desc: 'A free starter scene collection tuned for FPS streams with kill-feed-safe layouts and crosshair-safe webcam placement.', included: ['3 scene overlays', 'OBS scene collection (JSON)', 'Alert PNG set', 'Setup guide'] },
  { slug: 'tactical-menu-ui', img: '/images/ui.jpg', title: 'Tactical Menu UI', cat: 'game-ui', creator: 'northframe', price: 19, rating: 4.7, reviews: 87, downloads: 3100, art: 'ui', seed: 6, formats: ['PNG', 'Figma'], compat: ['Unity', 'Unreal', 'Figma'], dims: '1920 × 1080', size: '140 MB', license: L.std, tags: ['menu', 'inventory', 'dark'], desc: 'Main menu, loadout and inventory screens with component states for hover, pressed and disabled.', included: ['24 screens (Figma)', 'Component library', 'PNG exports at 1x/2x'] },
  { slug: 'neon-district-wallpapers', img: '/images/city.jpg', title: 'Night District Wallpaper Set', cat: 'wallpapers', creator: 'vexel', price: 0, rating: 4.5, reviews: 402, downloads: 15800, art: 'city', seed: 8, formats: ['JPG', 'PNG'], compat: ['Desktop', 'Mobile'], dims: '3840 × 2160 / 5120 × 1440', size: '220 MB', license: L.free, tags: ['city', '4k', 'ultrawide'], desc: 'Ten original wallpapers in 4K and 32:9 ultrawide. Warm night tones, no logos.', included: ['10 wallpapers 4K', '10 ultrawide versions', 'Mobile crops'] },
  { slug: 'hooded-agent-key-art', img: '/images/keyart.jpg', title: 'Hooded Agent Key Art', cat: '2d', creator: 'monoline', price: 15, rating: 4.7, reviews: 64, downloads: 1900, art: 'hood', seed: 9, formats: ['PNG', 'PSD'], compat: ['Photoshop', 'Krita'], dims: '4096 × 4096', size: '310 MB', license: L.std, tags: ['character', 'key art', 'layered'], desc: 'A layered character illustration with separated visor, hood and background layers for easy re-coloring.', included: ['Layered PSD', 'Flattened PNG', 'Colour variants x4'] },
  { slug: 'combat-sfx-essentials', img: '/images/audio.jpg', title: 'Combat SFX Essentials', cat: 'audio', creator: 'driftaudio', price: 18, rating: 4.6, reviews: 53, downloads: 1500, art: 'audio', seed: 1, formats: ['WAV'], compat: ['Any DAW', 'Unity', 'Unreal', 'FMOD'], dims: '48 kHz / 24-bit', size: '480 MB', license: L.ext, tags: ['sfx', 'impact', 'ui'], desc: '400 combat, impact and UI sound effects recorded and designed in-house, cleared for commercial game use.', included: ['400 WAV files', 'Metadata spreadsheet', 'License PDF'] },
  { slug: 'gridline-display-font', img: '/images/type.jpg', title: 'Gridline Display Font', cat: 'typography', creator: 'monoline', price: 12, rating: 4.8, reviews: 72, downloads: 2200, art: 'type', seed: 2, formats: ['OTF', 'TTF', 'WOFF2'], compat: ['Desktop apps', 'Web', 'Unity'], dims: '3 weights', size: '2 MB', license: L.std, tags: ['display', 'techno', 'sans'], desc: 'A squared display face built for scoreboards, HUD labels and posters. Includes tabular numerals.', included: ['3 weights (OTF/TTF)', 'WOFF2 web files', 'Specimen PDF'] },
  { slug: 'transition-motion-pack', img: '/images/lines.jpg', title: 'Slash Transition Pack', cat: 'animation', creator: 'ashenpixel', price: 14, rating: 4.4, reviews: 41, downloads: 1100, art: 'anim', seed: 12, formats: ['WebM', 'MOV'], compat: ['OBS', 'Premiere', 'DaVinci Resolve'], dims: '1920 × 1080 @ 60fps', size: '390 MB', license: L.std, tags: ['stinger', 'transition'], desc: '15 stinger transitions with alpha for live scene switching and video edits.', included: ['15 stingers (WebM alpha)', 'ProRes 4444 versions', 'OBS setup notes'] },
  { slug: 'team-identity-system', img: '/images/players.jpg', title: 'Team Identity System', cat: 'esports-kits', creator: 'kitforge', price: 49, rating: 4.9, reviews: 38, downloads: 960, art: 'badge', seed: 3, formats: ['AI', 'SVG', 'PNG', 'PDF'], compat: ['Illustrator', 'Figma import (SVG)'], dims: 'Vector', size: '72 MB', license: L.ext, tags: ['logo', 'brand', 'palette'], desc: 'Primary and secondary marks, wordmark, colour palette, typography and a brand usage sheet for esports teams.', included: ['Primary + secondary marks (AI/SVG)', 'Brand usage sheet (PDF)', 'Palette + type guide', 'Social avatars'], kit: true },
  { slug: 'pro-jersey-mockups', img: '/images/hoodie.jpg', title: 'Pro Jersey Mockup Set', cat: 'esports-kits', creator: 'kitforge', price: 34, rating: 4.7, reviews: 29, downloads: 840, art: 'jersey', seed: 10, formats: ['PSD', 'PNG'], compat: ['Photoshop', 'Photopea'], dims: '4000 × 4000', size: '540 MB', license: L.std, tags: ['jersey', 'hoodie', 'merch'], desc: 'Front/back jersey and hoodie presentation templates with smart-object artwork placement.', included: ['Jersey front + back (PSD)', 'Hoodie mockup (PSD)', 'Merch flat-lay scene'], kit: true },
  { slug: 'tournament-bracket-kit', img: '/images/crowd.jpg', title: 'Tournament Bracket Kit', cat: 'esports-kits', creator: 'kitforge', price: 22, rating: 4.6, reviews: 33, downloads: 1020, art: 'bracket', seed: 6, formats: ['PSD', 'SVG', 'PNG'], compat: ['Photoshop', 'Photopea'], dims: '1920 × 1080', size: '110 MB', license: L.std, tags: ['bracket', 'fixtures', 'results'], desc: 'Single and double-elimination brackets, fixture announcements and result cards.', included: ['8/16/32 team brackets', 'Fixture + result cards', 'Tournament banner'], kit: true },
  { slug: 'emote-badge-collection', img: '/images/controller.jpg', title: 'Emote & Badge Collection', cat: 'streaming', creator: 'ashenpixel', price: 9, rating: 4.5, reviews: 120, downloads: 4400, art: 'badge', seed: 8, formats: ['PNG', 'SVG'], compat: ['Twitch', 'Discord', 'YouTube'], dims: '112 / 56 / 28 px', size: '12 MB', license: L.std, tags: ['emotes', 'badges', 'sub'], desc: '24 emote bases plus sub badge tiers. Sized for Twitch, Discord and YouTube.', included: ['24 emotes (PNG + SVG)', '8 sub badges', 'Size guide'] },
  { slug: 'pixel-dungeon-sprites', title: 'Pixel Dungeon Sprites', cat: '2d', creator: 'vexel', price: 0, rating: 4.6, reviews: 260, downloads: 9100, art: 'sprite', seed: 4, formats: ['PNG', 'Aseprite'], compat: ['Unity', 'Godot', 'GameMaker'], dims: '16 × 16 tiles', size: '6 MB', license: L.cc0, tags: ['pixel', 'tileset', 'cc0'], desc: 'A CC0 dungeon tileset with characters, props and animated torches.', included: ['Tileset sheet', 'Character animations', 'Aseprite sources'] },
]

export const kitGallery = ['Primary logo sheet', 'Secondary marks', 'Roster card', 'Matchday poster', 'Result card', 'MVP card', 'Story template', 'Header set']

export const tools = [
  { slug: 'crosshair', name: 'Crosshair Generator', icon: 'Crosshair', desc: 'Design a crosshair and copy settings.' },
  { slug: 'sensitivity', name: 'Sensitivity Converter', icon: 'Mouse', desc: 'Convert sensitivity between games.' },
  { slug: 'name-generator', name: 'Gaming Name Generator', icon: 'Wand2', desc: 'Generate gamertag ideas by style.' },
  { slug: 'fps', name: 'FPS Calculator', icon: 'Gauge', desc: 'Frame time and refresh-rate maths.' },
  { slug: 'pc-builder', name: 'PC Build Planner', icon: 'Cpu', desc: 'Plan parts, check compatibility.' },
  { slug: 'palette', name: 'Color Palette Generator', icon: 'Palette', desc: 'Create, lock and export palettes.' },
  { slug: 'resolution', name: 'Resolution Calculator', icon: 'Maximize', desc: 'Aspect ratio and pixel dimensions.' },
  { slug: 'setup-planner', name: 'Gaming Setup Planner', icon: 'Monitor', desc: 'Checklist and desk layout planner.' },
]

export const studioTools = [
  { slug: 'banner', name: 'Gaming Banner Maker', w: 1500, h: 500, desc: 'X / Twitch / YouTube banners.' },
  { slug: 'logo', name: 'Logo / Badge Maker', w: 1000, h: 1000, desc: 'Team and channel marks.' },
  { slug: 'thumbnail', name: 'YouTube Thumbnail Maker', w: 1280, h: 720, desc: '1280×720 thumbnails.' },
  { slug: 'overlay', name: 'Stream Overlay Editor', w: 1920, h: 1080, desc: 'Scene overlays for OBS.' },
  { slug: 'team-poster', name: 'Esports Team Poster Maker', w: 1080, h: 1350, desc: 'Matchday and roster posters.' },
  { slug: 'profile-card', name: 'Gamer Profile Card', w: 1200, h: 630, desc: 'Share-ready profile cards.', soon: false },
  { slug: 'discord-banner', name: 'Discord Server Banner', w: 960, h: 540, desc: 'Server invite banners.' },
  { slug: 'wallpaper', name: 'Wallpaper Creator', w: 1920, h: 1080, desc: 'Desktop wallpapers.' },
]

export const shots = [
  { slug: 'ember-hud-concept', img: '/images/ui.jpg', title: 'Ember HUD concept', creator: 'northframe', art: 'hud', seed: 21, ratio: 'aspect-[4/3]', tags: ['hud', 'ui'], likes: 482, saves: 120, tools: ['Figma'], desc: 'Exploring a restrained amber HUD with large numerals and quiet chrome.' },
  { slug: 'agent-key-art', img: '/images/keyart.jpg', title: 'Agent key art study', creator: 'monoline', art: 'hood', seed: 22, ratio: 'aspect-[3/4]', tags: ['character', 'illustration'], likes: 910, saves: 230, tools: ['Photoshop'], desc: 'Hooded operative with orange visor accents. Silhouette first.' },
  { slug: 'matchday-poster-fnx', img: '/images/arena.jpg', title: 'Matchday poster — Ember FC', creator: 'kitforge', art: 'jersey', seed: 23, ratio: 'aspect-[4/5]', tags: ['esports', 'poster'], likes: 365, saves: 88, tools: ['Photoshop', 'Illustrator'], desc: 'Poster system for a fictional team. Two-colour palette, big type.' },
  { slug: 'island-diorama', img: '/images/moon.jpg', title: 'Island diorama', creator: 'vexel', art: 'lowpoly', seed: 24, ratio: 'aspect-[16/10]', tags: ['3d', 'environment'], likes: 640, saves: 174, tools: ['Blender'], desc: 'Low poly diorama rendered in Blender with a single directional light.' },
  { slug: 'stream-setup-dark', img: '/images/stream.jpg', title: 'Dark stream setup', creator: 'ashenpixel', art: 'stream', seed: 25, ratio: 'aspect-[4/3]', tags: ['setup', 'stream'], likes: 289, saves: 70, tools: ['OBS'], desc: 'Overlay and scene layout for a minimal desk setup.' },
  { slug: 'night-city-wall', img: '/images/city.jpg', title: 'Night city wallpaper', creator: 'vexel', art: 'city', seed: 26, ratio: 'aspect-[3/4]', tags: ['wallpaper', 'city'], likes: 733, saves: 301, tools: ['Procreate'], desc: 'Vertical wallpaper with warm window lights.' },
  { slug: 'grid-type-poster', img: '/images/type.jpg', title: 'Gridline type poster', creator: 'monoline', art: 'type', seed: 27, ratio: 'aspect-[1/1]', tags: ['typography'], likes: 211, saves: 55, tools: ['Illustrator'], desc: 'Poster specimen for a squared display font.' },
  { slug: 'badge-system', title: 'Badge system v2', creator: 'kitforge', art: 'badge', seed: 28, ratio: 'aspect-[1/1]', tags: ['logo', 'esports'], likes: 420, saves: 99, tools: ['Illustrator'], desc: 'Shield-based badge construction for a fictional esports org.' },
  { slug: 'wave-sfx-ui', title: 'Waveform UI for SFX tool', creator: 'driftaudio', art: 'audio', seed: 29, ratio: 'aspect-[16/10]', tags: ['ui', 'audio'], likes: 143, saves: 31, tools: ['Figma'], desc: 'Sound designer tool UI exploration.' },
  { slug: 'bracket-visual', img: '/images/crowd.jpg', title: 'Bracket visual language', creator: 'kitforge', art: 'bracket', seed: 30, ratio: 'aspect-[4/3]', tags: ['esports', 'ui'], likes: 330, saves: 82, tools: ['Figma'], desc: 'Clean bracket connectors that scale to 32 teams.' },
]

export const collections = [
  { slug: 'fps-stream-starter', title: 'FPS Stream Starter Pack', art: 'stream', seed: 31, items: ['fps-stream-starter-pack', 'esports-stream-pack', 'emote-badge-collection', 'transition-motion-pack'], desc: 'Everything to launch an FPS channel — scenes, alerts, emotes and transitions.', sponsored: false },
  { slug: 'matchday-essentials', title: 'Esports Matchday Essentials', art: 'jersey', seed: 32, items: ['matchday-social-kit', 'tournament-bracket-kit', 'team-identity-system', 'pro-jersey-mockups'], desc: 'Posters, brackets, identity and merch for tournament weekends.', sponsored: false },
  { slug: 'indie-ui-toolkit', title: 'Indie Game UI Toolkit', art: 'hud', seed: 33, items: ['futuristic-hud-kit', 'tactical-menu-ui', 'gridline-display-font', 'combat-sfx-essentials'], desc: 'UI, type and sound for your next prototype.', sponsored: true, sponsor: 'Sample Sponsor' },
]

export const guides = [
  { slug: 'obs-setup-for-beginners', img: '/images/stream.jpg', title: 'OBS setup for beginners', cat: 'Streaming', read: '8 min', art: 'stream', seed: 41, excerpt: 'Scenes, sources, audio and bitrate — a clean first setup.' },
  { slug: 'design-stream-overlays', img: '/images/setup-light.jpg', title: 'How to design stream overlays that don’t get in the way', cat: 'Design', read: '6 min', art: 'hud', seed: 42, excerpt: 'Safe areas, hierarchy and motion rules for overlays.' },
  { slug: 'gaming-branding-basics', img: '/images/hoodie.jpg', title: 'Gaming branding basics', cat: 'Branding', read: '7 min', art: 'badge', seed: 43, excerpt: 'Build a consistent identity across avatar, banner and thumbnail.' },
  { slug: 'thumbnail-design', img: '/images/gameover.jpg', title: 'Thumbnail design that earns the click', cat: 'Design', read: '5 min', art: 'poster', seed: 44, excerpt: 'Contrast, faces, text size and testing.' },
  { slug: 'free-game-dev-assets', title: 'Finding free game-development assets safely', cat: 'Game dev', read: '9 min', art: 'sprite', seed: 45, excerpt: 'Read licenses properly and avoid takedown surprises.' },
  { slug: 'unity-vs-unreal', img: '/images/dualmon.jpg', title: 'Unity vs Unreal for small teams', cat: 'Game dev', read: '10 min', art: 'lowpoly', seed: 46, excerpt: 'A practical comparison for small teams and solo devs.' },
  { slug: 'pc-setup-guide', img: '/images/pcsetup.jpg', title: 'PC setup guide for competitive play', cat: 'Hardware', read: '8 min', art: 'ui', seed: 47, excerpt: 'Monitor, peripherals and settings that matter.' },
  { slug: 'creator-workflows', img: '/images/dev.jpg', title: 'Creator workflows: from idea to published', cat: 'Workflow', read: '6 min', art: 'anim', seed: 48, excerpt: 'A repeatable process for shipping design work.' },
]

export const challenges = [
  { slug: 'hud-redesign', title: 'Redesign a HUD in one colour', ends: 'Sample · ends in 9 days', entries: 64, art: 'hud', seed: 51 },
  { slug: 'matchday-poster', title: 'Matchday poster for a fictional team', ends: 'Sample · ends in 21 days', entries: 38, art: 'jersey', seed: 52 },
  { slug: 'emote-sprint', title: 'Emote sprint: 8 emotes in a week', ends: 'Sample · ended', entries: 120, art: 'badge', seed: 53 },
]

export const teams = [{ slug: 'ember-fc', name: 'Ember FC (fictional)', game: 'Tactical FPS', region: 'APAC', roster: ['Kairo', 'Vex', 'Nyla', 'Sora', 'Dax'], achievements: ['Sample Cup 2025 — Finalist', 'Sample League S3 — Top 4'] }]

export const palettes = [
  ['#12100E', '#1B1815', '#F4ECDF', '#FF4D3D', '#9A8F82'],
]

export const getAsset = (slug) => assets.find((a) => a.slug === slug)
export const getCat = (slug) => categories.find((c) => c.slug === slug)
export const getCreator = (u) => creators.find((c) => c.username === u)
export const fmtNum = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n))
