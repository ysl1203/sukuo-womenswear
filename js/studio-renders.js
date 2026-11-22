/* ==========================================================================
   素廓 Sukuo — Shaded Couture Studio Garment & Lookboard Renderer
   Renders volume-lit studio garment plates on matching #E5E7EB studio paper,
   reacting live to colorway selection, plus Atelier Styling Lookboards.
   ========================================================================== */

/**
 * Helper to adjust hex brightness for realistic highlight/shadow stops
 */
function shadeHex(hex, percent) {
  const clean = (hex || '#4A4E57').replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 255) + Math.round(2.55 * percent)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getLuminance(hex) {
  const clean = (hex || '#4A4E57').replace('#', '');
  if (clean.length !== 6) return 128;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Shared studio defs: soft gallery vignette, directional fabric lighting, drop shadow
 */
function buildStudioDefs(uid, baseHex, isSatin = false) {
  const lum = getLuminance(baseHex);
  const hi = shadeHex(baseHex, isSatin ? 24 : lum < 60 ? 15 : 9);
  const mid = baseHex;
  const sh = shadeHex(baseHex, isSatin ? -20 : lum < 60 ? -12 : -14);
  const deep = shadeHex(baseHex, -24);
  const stitch = lum < 85 ? 'rgba(245,246,248,0.28)' : 'rgba(24,26,31,0.24)';
  const edge = lum < 85 ? shadeHex(baseHex, -16) : shadeHex(baseHex, -20);

  const defs = `
    <defs>
      <radialGradient id="bg_${uid}" cx="46%" cy="38%" r="72%">
        <stop offset="0%" stop-color="#ECEEF2" />
        <stop offset="100%" stop-color="#E1E4E9" />
      </radialGradient>
      <linearGradient id="body_${uid}" x1="12%" y1="8%" x2="90%" y2="92%">
        <stop offset="0%" stop-color="${hi}" />
        <stop offset="48%" stop-color="${mid}" />
        <stop offset="100%" stop-color="${sh}" />
      </linearGradient>
      <linearGradient id="satin_${uid}" x1="0%" y1="15%" x2="100%" y2="75%">
        <stop offset="0%" stop-color="${sh}" />
        <stop offset="28%" stop-color="${hi}" />
        <stop offset="52%" stop-color="${mid}" />
        <stop offset="74%" stop-color="${hi}" />
        <stop offset="100%" stop-color="${deep}" />
      </linearGradient>
      <linearGradient id="sleeve_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${hi}" />
        <stop offset="65%" stop-color="${mid}" />
        <stop offset="100%" stop-color="${sh}" />
      </linearGradient>
      <linearGradient id="inner_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${deep}" />
        <stop offset="100%" stop-color="${sh}" />
      </linearGradient>
      <filter id="softShadow_${uid}" x="-18%" y="-10%" width="136%" height="128%">
        <feDropShadow dx="4" dy="14" stdDeviation="11" flood-color="#181A1F" flood-opacity="0.13" />
      </filter>
      <filter id="partShadow_${uid}" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="1" dy="4" stdDeviation="3.5" flood-color="#181A1F" flood-opacity="0.16" />
      </filter>
    </defs>
  `;

  return { defs, hi, mid, sh, deep, stitch, edge };
}

/**
 * Generates high-craft shaded studio garment artwork (viewBox 0 0 360 480)
 */
export function renderStudioGarmentSvg(product, colorHex, instanceSuffix = 'c') {
  const uid = `${product.patternKey.replace(/[^a-z0-9]/gi, '')}_${instanceSuffix}`;
  const isSatin = product.patternKey === 'satin-dress';
  const { defs, hi, mid, sh, deep, stitch, edge } = buildStudioDefs(uid, colorHex || product.colors[0].hex, isSatin);

  const pieces = {
    'trench-coat': `
      <g filter="url(#softShadow_${uid})">
        <!-- Inner Collar Shadow -->
        <path d="M148 56 Q180 74 212 56 L204 114 L156 114 Z" fill="url(#inner_${uid})" />
        <!-- Sleeves -->
        <path d="M94 86 L62 256 L92 262 L114 146 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.9" />
        <path d="M266 86 L298 256 L268 262 L246 146 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Main Architectural Coat Drape -->
        <path d="M148 56 L94 86 L112 146 L94 426 Q180 434 266 426 L248 146 L266 86 L212 56 L180 120 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Subtle Center Flap & Fold Depth -->
        <path d="M184 116 L186 428 L176 428 L176 122 Z" fill="${sh}" opacity="0.52" />
        <path d="M192 104 L250 100 L246 160 L194 152 Z" fill="${hi}" opacity="0.72" filter="url(#partShadow_${uid})" />
        <!-- Clean Minimalist Collar -->
        <path d="M148 56 L130 92 L166 106 L180 76 Z" fill="${hi}" stroke="${edge}" stroke-width="0.8" filter="url(#partShadow_${uid})" />
        <path d="M212 56 L230 92 L194 106 L180 76 Z" fill="${mid}" stroke="${edge}" stroke-width="0.8" filter="url(#partShadow_${uid})" />
        <!-- Self-Tie Belt & Draped Tails -->
        <rect x="108" y="210" width="144" height="17" rx="3" fill="${hi}" stroke="${edge}" stroke-width="0.85" filter="url(#partShadow_${uid})" />
        <path d="M190 218 Q198 254 196 318 L210 320 Q212 256 204 224 Z" fill="${mid}" stroke="${edge}" stroke-width="0.8" filter="url(#partShadow_${uid})" />
        <path d="M178 218 Q172 250 174 294 L187 296 Q186 250 192 224 Z" fill="${hi}" stroke="${edge}" stroke-width="0.8" />
        <rect x="180" y="207" width="16" height="23" rx="3" fill="${mid}" stroke="${edge}" stroke-width="0.85" />
        <!-- Cuff Tabs & Hem Shadow -->
        <rect x="66" y="238" width="26" height="8" rx="1.5" fill="${sh}" />
        <rect x="268" y="238" width="26" height="8" rx="1.5" fill="${sh}" />
        <line x1="184" y1="118" x2="184" y2="426" stroke="${stitch}" stroke-width="0.9" />
      </g>
    `,

    'wool-blazer': `
      <g filter="url(#softShadow_${uid})">
        <!-- Inner Back Neck Lining -->
        <path d="M146 76 Q180 96 214 76 L206 164 L154 164 Z" fill="url(#inner_${uid})" />
        <!-- Sleeves -->
        <path d="M90 100 L64 292 L96 296 L114 164 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.9" />
        <path d="M270 100 L296 292 L264 296 L246 164 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Oversized Architectural Blazer Body -->
        <path d="M146 76 L90 100 L114 164 L108 370 H176 L180 356 L184 370 H252 L246 164 L270 100 L214 76 L180 236 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Crisp Sculpted Notched Lapels -->
        <path d="M146 76 L132 132 L150 140 L138 156 L180 238 L162 118 Z" fill="${hi}" stroke="${edge}" stroke-width="0.85" filter="url(#partShadow_${uid})" />
        <path d="M214 76 L228 132 L210 140 L222 156 L180 238 L198 118 Z" fill="${mid}" stroke="${edge}" stroke-width="0.85" filter="url(#partShadow_${uid})" />
        <!-- Front Overlap & Horn Button -->
        <line x1="180" y1="236" x2="180" y2="356" stroke="${deep}" stroke-width="1.1" />
        <circle cx="180" cy="248" r="5" fill="#1F2229" stroke="${stitch}" stroke-width="0.8" />
        <!-- Welt Breast Pocket & Flap Pockets -->
        <path d="M202 164 L232 159 L232 164 L202 169 Z" fill="${sh}" />
        <rect x="122" y="286" width="42" height="11" rx="1" fill="${sh}" stroke="${edge}" stroke-width="0.7" />
        <rect x="196" y="286" width="42" height="11" rx="1" fill="${sh}" stroke="${edge}" stroke-width="0.7" />
        <!-- Subtle Vertical Tailoring Darts -->
        <line x1="142" y1="194" x2="140" y2="278" stroke="${stitch}" stroke-width="0.85" />
        <line x1="218" y1="194" x2="220" y2="278" stroke="${stitch}" stroke-width="0.85" />
      </g>
    `,

    'merino-cardigan': `
      <g filter="url(#softShadow_${uid})">
        <!-- Inner Rib Neckline Back -->
        <path d="M146 104 Q180 130 214 104 Q180 116 146 104 Z" fill="url(#inner_${uid})" />
        <!-- Sleeves -->
        <path d="M100 124 L68 294 L98 300 L118 184 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.85" />
        <path d="M260 124 L292 294 L262 300 L242 184 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.85" />
        <!-- Cropped Merino Body -->
        <path d="M146 104 Q180 128 214 104 L260 124 L242 184 L242 332 H118 L118 184 L100 124 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Ribbed Collar, Placket, Hem & Cuffs -->
        <path d="M142 108 Q180 134 218 108" fill="none" stroke="${sh}" stroke-width="6" stroke-linecap="round" />
        <rect x="174" y="122" width="12" height="210" fill="${sh}" opacity="0.55" />
        <rect x="118" y="312" width="124" height="20" fill="${sh}" opacity="0.52" />
        <path d="M72 276 L101 282 L98 300 L68 294 Z M288 276 L259 282 L262 300 L292 294 Z" fill="${sh}" opacity="0.55" />
        <!-- Subtle Knit Rib Lines along Hem -->
        <g stroke="${stitch}" stroke-width="0.8">
          <line x1="128" y1="313" x2="128" y2="331" /><line x1="138" y1="313" x2="138" y2="331" />
          <line x1="148" y1="313" x2="148" y2="331" /><line x1="158" y1="313" x2="158" y2="331" />
          <line x1="168" y1="313" x2="168" y2="331" /><line x1="192" y1="313" x2="192" y2="331" />
          <line x1="202" y1="313" x2="202" y2="331" /><line x1="212" y1="313" x2="212" y2="331" />
          <line x1="222" y1="313" x2="222" y2="331" /><line x1="232" y1="313" x2="232" y2="331" />
        </g>
        <!-- Matte Tonal Buttons -->
        <g fill="${deep}" stroke="${stitch}" stroke-width="0.7">
          <circle cx="180" cy="144" r="3.6" />
          <circle cx="180" cy="182" r="3.6" />
          <circle cx="180" cy="220" r="3.6" />
          <circle cx="180" cy="258" r="3.6" />
          <circle cx="180" cy="296" r="3.6" />
        </g>
      </g>
    `,

    'poplin-shirt': `
      <g filter="url(#softShadow_${uid})">
        <!-- Back Collar Inside -->
        <path d="M150 82 Q180 96 210 82 L206 112 L154 112 Z" fill="url(#inner_${uid})" />
        <!-- Sleeves -->
        <path d="M94 106 L62 292 L92 298 L114 166 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.85" />
        <path d="M266 106 L298 292 L268 298 L246 166 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.85" />
        <!-- Crisp Poplin Body with Curved Shirt-Tail Hem -->
        <path d="M150 82 L94 106 L114 166 L112 362 Q180 388 248 362 L246 166 L266 106 L210 82 L180 100 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.85" />
        <!-- Subtle Crisp Vertical Crease Shading -->
        <path d="M138 154 Q134 252 130 364" fill="none" stroke="${sh}" stroke-width="6" opacity="0.22" />
        <path d="M222 154 Q226 252 230 364" fill="none" stroke="${sh}" stroke-width="6" opacity="0.22" />
        <!-- Concealed Placket -->
        <rect x="174" y="102" width="12" height="273" fill="${hi}" stroke="${edge}" stroke-width="0.65" />
        <!-- Architectural Pointed Collar -->
        <path d="M150 82 L138 126 L176 106 L180 96 Z" fill="${hi}" stroke="${edge}" stroke-width="0.8" filter="url(#partShadow_${uid})" />
        <path d="M210 82 L222 126 L184 106 L180 96 Z" fill="${hi}" stroke="${edge}" stroke-width="0.8" filter="url(#partShadow_${uid})" />
        <!-- Wide Structured Cuffs -->
        <path d="M66 268 L96 274 L92 298 L62 292 Z M294 268 L264 274 L268 298 L298 292 Z" fill="${hi}" stroke="${edge}" stroke-width="0.8" />
      </g>
    `,

    'rib-turtleneck': `
      <g filter="url(#softShadow_${uid})">
        <!-- Sleeves -->
        <path d="M104 124 L74 306 L100 310 L122 178 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.85" />
        <path d="M256 124 L286 306 L260 310 L238 178 Z" fill="url(#sleeve_${uid})" stroke="${edge}" stroke-width="0.85" />
        <!-- Slim Mock-Neck Body -->
        <path d="M154 78 H206 V108 L256 124 L238 178 L234 360 H126 L122 178 L104 124 L154 108 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Mock Neck Collar Depth -->
        <rect x="154" y="78" width="52" height="30" fill="${hi}" opacity="0.45" />
        <line x1="154" y1="108" x2="206" y2="108" stroke="${edge}" stroke-width="0.8" />
        <!-- Fine Vertical Knit Rib Texture -->
        <g stroke="${sh}" stroke-width="1.2" opacity="0.48">
          <line x1="138" y1="122" x2="136" y2="358" /><line x1="149" y1="116" x2="148" y2="358" />
          <line x1="160" y1="110" x2="160" y2="358" /><line x1="170" y1="80" x2="170" y2="358" />
          <line x1="180" y1="80" x2="180" y2="358" /><line x1="190" y1="80" x2="190" y2="358" />
          <line x1="200" y1="110" x2="200" y2="358" /><line x1="211" y1="116" x2="212" y2="358" />
          <line x1="222" y1="122" x2="224" y2="358" />
        </g>
      </g>
    `,

    'pleated-skirt': `
      <g filter="url(#softShadow_${uid})">
        <!-- Structured High Waistband -->
        <rect x="128" y="88" width="104" height="24" fill="${sh}" stroke="${edge}" stroke-width="0.9" />
        <!-- Knife-Pleated Skirt Base -->
        <path d="M128 112 L78 402 L282 402 L232 112 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Alternating Chiaroscuro Knife-Pleat Facets -->
        <polygon points="128,112 138,112 98,404 78,402" fill="${sh}" opacity="0.55" />
        <polygon points="148,112 158,112 134,405 116,403" fill="${hi}" opacity="0.45" />
        <polygon points="158,112 169,112 156,406 134,405" fill="${sh}" opacity="0.5" />
        <polygon points="180,112 191,112 196,406 178,406" fill="${hi}" opacity="0.45" />
        <polygon points="191,112 202,112 218,405 196,406" fill="${sh}" opacity="0.52" />
        <polygon points="212,112 222,112 258,403 238,404" fill="${hi}" opacity="0.38" />
        <polygon points="222,112 232,112 282,402 258,403" fill="${sh}" opacity="0.58" />
        <!-- Razor Pleat Edge Lines -->
        <g stroke="${deep}" stroke-width="0.75" opacity="0.65">
          <line x1="138" y1="112" x2="98" y2="404" /><line x1="148" y1="112" x2="116" y2="403" />
          <line x1="158" y1="112" x2="134" y2="405" /><line x1="169" y1="112" x2="156" y2="406" />
          <line x1="180" y1="112" x2="178" y2="406" /><line x1="191" y1="112" x2="196" y2="406" />
          <line x1="202" y1="112" x2="218" y2="405" /><line x1="212" y1="112" x2="238" y2="404" />
          <line x1="222" y1="112" x2="258" y2="403" />
        </g>
      </g>
    `,

    'satin-dress': `
      <g filter="url(#softShadow_${uid})">
        <!-- Delicate Spaghetti Straps -->
        <line x1="138" y1="54" x2="138" y2="112" stroke="${mid}" stroke-width="2.6" />
        <line x1="222" y1="54" x2="222" y2="112" stroke="${sh}" stroke-width="2.6" />
        <!-- Inner Back Neckline -->
        <path d="M138 112 Q180 124 222 112 Q180 144 138 112 Z" fill="${deep}" />
        <!-- Liquid Bias-Cut Satin Midi Silhouette -->
        <path d="M138 112 Q180 138 222 112 L234 156 Q220 206 226 254 L262 424 Q180 438 98 424 L134 254 Q140 206 126 156 Z" fill="url(#satin_${uid})" stroke="${edge}" stroke-width="0.85" />
        <!-- Soft Draped Cowl Neckline Highlights -->
        <path d="M142 122 Q180 152 218 122" fill="none" stroke="${hi}" stroke-width="3" opacity="0.65" />
        <path d="M148 136 Q180 162 212 136" fill="none" stroke="${deep}" stroke-width="1.5" opacity="0.5" />
        <!-- Liquid Silk Vertical Drape Highlights at Skirt Hem -->
        <path d="M134 422 Q154 344 162 278 Q170 348 164 428 Z" fill="${hi}" opacity="0.28" />
        <path d="M210 428 Q204 348 202 284 Q222 350 234 424 Z" fill="${deep}" opacity="0.32" />
      </g>
    `,

    'selvedge-denim': `
      <g filter="url(#softShadow_${uid})">
        <!-- High Denim Waistband -->
        <rect x="124" y="64" width="112" height="24" fill="${sh}" stroke="${edge}" stroke-width="0.9" />
        <!-- Straight Relaxed Indigo Legs -->
        <path d="M124 88 L112 422 L168 422 L180 198 L192 422 L248 422 L236 88 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="0.9" />
        <!-- Subtle Center Thigh Sheen & Crease -->
        <path d="M138 114 L132 390" stroke="${hi}" stroke-width="16" opacity="0.22" stroke-linecap="round" />
        <path d="M222 114 L228 390" stroke="${hi}" stroke-width="16" opacity="0.22" stroke-linecap="round" />
        <!-- Pockets, Fly & Matte Button -->
        <circle cx="180" cy="76" r="4" fill="#9CA3AF" stroke="${deep}" stroke-width="0.9" />
        <path d="M124 134 Q150 130 156 88 M236 134 Q210 130 204 88" fill="none" stroke="${stitch}" stroke-width="1.2" />
        <path d="M180 88 V162 Q180 174 170 178" fill="none" stroke="${stitch}" stroke-width="1.1" />
        <!-- Authentic Selvedge Turn-Up Cuffs with Bordeaux/Red Edge -->
        <rect x="112" y="394" width="56" height="28" fill="#CFD5DF" stroke="${edge}" stroke-width="0.85" />
        <rect x="192" y="394" width="56" height="28" fill="#C6CDD8" stroke="${edge}" stroke-width="0.85" />
        <line x1="116" y1="395" x2="116" y2="421" stroke="#8C2636" stroke-width="1.8" />
        <line x1="244" y1="395" x2="244" y2="421" stroke="#8C2636" stroke-width="1.8" />
      </g>
    `,

    'leather-tote': `
      <g filter="url(#softShadow_${uid})">
        <!-- Back & Front Slender Arched Straps -->
        <path d="M144 192 C144 86, 216 86, 216 192" fill="none" stroke="${deep}" stroke-width="5.5" />
        <path d="M134 196 C134 74, 226 74, 226 196" fill="none" stroke="${mid}" stroke-width="6.5" />
        <path d="M134 196 C134 74, 226 74, 226 196" fill="none" stroke="${hi}" stroke-width="1.5" opacity="0.55" />
        <!-- Structured Vertical Grained Calfskin Body -->
        <path d="M100 190 H260 L248 404 H112 Z" fill="url(#body_${uid})" stroke="${edge}" stroke-width="1" />
        <!-- Architectural Side Gusset Fold Planes -->
        <polygon points="100,190 120,190 126,404 112,404" fill="${hi}" opacity="0.22" />
        <polygon points="240,190 260,190 248,404 234,404" fill="${deep}" opacity="0.34" />
        <!-- Top Seam & Brushed Silver Bridge Clasp -->
        <line x1="102" y1="206" x2="258" y2="206" stroke="${stitch}" stroke-width="0.9" />
        <rect x="171" y="192" width="18" height="24" rx="2" fill="#D5D9E0" stroke="#7A808D" stroke-width="0.9" />
        <circle cx="180" cy="204" r="2.6" fill="#4E535E" />
      </g>
    `,

    'sculptural-bag': `
      <g filter="url(#softShadow_${uid})">
        <!-- Clean Sculpted Shoulder Strap -->
        <path d="M84 238 C94 112, 266 112, 276 238" fill="none" stroke="${sh}" stroke-width="9" />
        <path d="M84 238 C94 112, 266 112, 276 238" fill="none" stroke="${hi}" stroke-width="2.5" opacity="0.45" />
        <!-- Elongated Folded-Pleat Baguette Body -->
        <path d="M70 236 Q180 226 290 236 L300 332 Q180 348 60 332 Z" fill="url(#satin_${uid})" stroke="${edge}" stroke-width="0.95" />
        <!-- Sculpted Origami Front Fold -->
        <path d="M70 236 Q180 288 290 236 L284 252 Q180 296 76 252 Z" fill="${deep}" opacity="0.38" />
        <path d="M70 236 Q180 282 290 236" fill="none" stroke="${hi}" stroke-width="1.6" opacity="0.55" />
        <!-- Side Gusset Creases & Brushed Rings -->
        <path d="M76 250 L92 336 M284 250 L268 336" stroke="${deep}" stroke-width="1.2" opacity="0.5" />
        <circle cx="84" cy="238" r="5" fill="#C9CDD6" stroke="#6E7480" stroke-width="1" />
        <circle cx="276" cy="238" r="5" fill="#C9CDD6" stroke="#6E7480" stroke-width="1" />
      </g>
    `
  };

  const innerArtwork = pieces[product.patternKey] || pieces['wool-blazer'];

  return `
    <svg class="studio-render-svg" viewBox="0 0 360 480" role="img" aria-label="${product.name} 棚拍质感展示图" xmlns="http://www.w3.org/2000/svg">
      ${defs}
      <rect width="360" height="480" fill="url(#bg_${uid})" />
      <!-- Subtle Floor Contact Shadow -->
      <ellipse cx="180" cy="436" rx="92" ry="11" fill="#181A1F" opacity="0.065" />
      ${innerArtwork}
    </svg>
  `;
}

/**
 * Renders the 2 curated Atelier Styling Boards (Look 2 Evening & Look 3 Campus)
 * so every Lookbook tab has a magazine-grade visual canvas with calibrated hotspots.
 * Note: Look 1 uses the real full-body photograph hero_campaign.jpg directly!
 */
export function renderAtelierLookboard(look, productsById) {
  if (look.id === 'look-evening') {
    const dress = productsById['satin-dress'];
    const bag = productsById['sculptural-bag'];
    return `
      <div class="atelier-board atelier-board-evening" role="img" aria-label="${look.title} 工坊搭配画板">
        <div class="board-photo-cutout board-evening-coat">
          <img src="assets/images/prod_doubleface_coat.jpg" alt="双面羊绒廓形大衣" />
        </div>
        <div class="board-svg-cutout board-evening-dress">
          ${renderStudioGarmentSvg(dress, dress.colors[0].hex, 'lbe1')}
        </div>
        <div class="board-svg-cutout board-evening-bag">
          ${renderStudioGarmentSvg(bag, bag.colors[0].hex, 'lbe2')}
        </div>
        <span class="board-editorial-stamp">工坊搭配板 / 柔光晚间剪裁</span>
      </div>
    `;
  }

  // Look 3: Campus Layered Styling Board
  const cardigan = productsById['merino-cardigan'];
  const shirt = productsById['poplin-shirt'];
  const skirt = productsById['pleated-skirt'];
  const tote = productsById['leather-tote'];

  return `
    <div class="atelier-board atelier-board-campus" role="img" aria-label="${look.title} 工坊搭配画板">
      <div class="board-svg-cutout board-campus-cardigan">
        ${renderStudioGarmentSvg(cardigan, cardigan.colors[0].hex, 'lbc1')}
      </div>
      <div class="board-svg-cutout board-campus-shirt">
        ${renderStudioGarmentSvg(shirt, shirt.colors[0].hex, 'lbc2')}
      </div>
      <div class="board-svg-cutout board-campus-skirt">
        ${renderStudioGarmentSvg(skirt, skirt.colors[0].hex, 'lbc3')}
      </div>
      <div class="board-svg-cutout board-campus-tote">
        ${renderStudioGarmentSvg(tote, tote.colors[0].hex, 'lbc4')}
      </div>
      <span class="board-editorial-stamp">工坊搭配板 / 松弛学院叠穿</span>
    </div>
  `;
}
