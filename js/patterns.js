/* ==========================================================================
   素廓 Sukuo — Architectural Garment Technical Flat Engine
   Generates bespoke SVG fashion flats with live size dimension callouts
   ========================================================================== */

const INK = '#181A1F';
const SEAM = '#555A65';
const GUIDE = '#B4B9C4';
const ACCENT = '#6D1D2C';

/**
 * Lightens or tints a hex swatch into a refined translucent watercolor wash
 * so technical flats visually echo the user's selected color without losing crisp ink lines.
 */
function hexToSoftTint(hex = '#D8DCE2', alpha = 0.22) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return `rgba(210, 214, 222, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Keep very dark colors legible beneath dark technical ink lines
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const effectiveAlpha = lum < 65 ? Math.min(alpha, 0.14) : Math.min(alpha + 0.08, 0.34);
  return `rgba(${r}, ${g}, ${b}, ${effectiveAlpha.toFixed(2)})`;
}

/**
 * Architectural drafting frame (corner register marks & subtle centerline)
 */
function draftingBackdrop(showDimensions) {
  return `
    <rect x="0" y="0" width="360" height="460" fill="#F5F6F8" />
    <g stroke="${GUIDE}" stroke-width="0.75" opacity="0.65">
      <path d="M18 32 V18 H32 M328 18 H342 V32 M18 428 V442 H32 M328 442 H342 V428" fill="none" />
      ${showDimensions ? `<line x1="180" y1="36" x2="180" y2="424" stroke-dasharray="3 5" opacity="0.55" />` : ''}
    </g>
  `;
}

/**
 * Individual flat drawings by patternKey (viewBox 0 0 360 460)
 */
const GARMENT_DRAWINGS = {
  'doubleface-coat': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Main Coat Body -->
      <path d="M148 56 L180 68 L212 56 L264 82 L292 224 L264 230 L248 134 L256 392 L104 392 L112 134 L96 230 L68 224 L96 82 Z" fill="${fill}" />
      <!-- Wide Notched Lapels -->
      <path d="M148 56 L132 108 L150 116 L138 136 L186 212" fill="#FCFCFD" fill-opacity="0.55" />
      <path d="M212 56 L228 108 L210 116 L222 136 L176 196" fill="#FCFCFD" fill-opacity="0.55" />
      <!-- Wrap Front Overlap -->
      <line x1="186" y1="212" x2="186" y2="392" />
      <line x1="168" y1="200" x2="168" y2="392" stroke="${SEAM}" stroke-width="0.9" stroke-dasharray="3 3" />
      <!-- Self-Tie Belt & Draped Ends -->
      <rect x="111" y="196" width="138" height="16" rx="2" fill="#FCFCFD" fill-opacity="0.85" />
      <path d="M168 204 Q158 232 152 274 L164 277 Q170 236 178 212 Z" fill="#FCFCFD" fill-opacity="0.9" />
      <path d="M180 206 Q192 238 197 284 L185 286 Q180 242 174 212 Z" fill="#FCFCFD" fill-opacity="0.82" />
      <ellipse cx="175" cy="204" rx="8" ry="6" fill="#FCFCFD" />
      <!-- Welt Pockets & Dropped Shoulder Seams -->
      <line x1="126" y1="256" x2="154" y2="262" stroke="${SEAM}" stroke-width="1.2" />
      <line x1="234" y1="256" x2="206" y2="262" stroke="${SEAM}" stroke-width="1.2" />
      <path d="M96 82 Q108 110 112 134 M264 82 Q252 110 248 134" fill="none" stroke="${SEAM}" stroke-width="0.95" />
      <line x1="106" y1="382" x2="254" y2="382" stroke="${SEAM}" stroke-width="0.8" stroke-dasharray="3 3" />
    </g>
  `,

  'trench-coat': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Trench Silhouette -->
      <path d="M150 54 L180 65 L210 54 L262 78 L294 232 L266 238 L248 138 L260 398 L100 398 L112 138 L94 238 L66 232 L98 78 Z" fill="${fill}" />
      <!-- Structured Collar & Lapels -->
      <path d="M150 54 L138 94 L164 114 L180 156 L196 114 L222 94 L210 54 Z" fill="#FCFCFD" fill-opacity="0.65" />
      <!-- Architectural Storm Flap (Right Chest) -->
      <path d="M192 108 L248 102 L244 156 L194 148 Z" fill="#FCFCFD" fill-opacity="0.52" />
      <!-- Double-Breasted Center & Buttons -->
      <line x1="184" y1="154" x2="184" y2="398" />
      <g fill="${INK}" stroke="none">
        <circle cx="164" cy="148" r="3" />
        <circle cx="196" cy="148" r="3" />
        <circle cx="164" cy="176" r="3" />
        <circle cx="196" cy="176" r="3" />
        <circle cx="164" cy="236" r="3" />
        <circle cx="196" cy="236" r="3" />
      </g>
      <!-- Waist Belt & Buckle -->
      <rect x="111" y="198" width="138" height="15" rx="1.5" fill="#FCFCFD" fill-opacity="0.88" />
      <rect x="171" y="195" width="16" height="21" rx="2" fill="none" stroke="${INK}" stroke-width="1.35" />
      <!-- Sleeve Tabs & Slanted Welt Pockets -->
      <rect x="70" y="214" width="24" height="7" fill="#FCFCFD" fill-opacity="0.7" />
      <rect x="266" y="214" width="24" height="7" fill="#FCFCFD" fill-opacity="0.7" />
      <line x1="120" y1="252" x2="146" y2="274" stroke="${SEAM}" stroke-width="1.2" />
      <line x1="240" y1="252" x2="214" y2="274" stroke="${SEAM}" stroke-width="1.2" />
      <path d="M98 78 L112 138 M262 78 L248 138" stroke="${SEAM}" stroke-width="0.95" />
    </g>
  `,

  'wool-blazer': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Structured Architectural Blazer -->
      <path d="M148 76 L180 88 L212 76 L268 96 L292 272 L262 276 L246 156 L248 338 L184 338 L180 326 L176 338 L112 338 L114 156 L98 276 L68 272 L92 96 Z" fill="${fill}" />
      <!-- Sharp Notched Lapels -->
      <path d="M148 76 L136 124 L152 132 L142 146 L180 226" fill="#FCFCFD" fill-opacity="0.6" />
      <path d="M212 76 L224 124 L208 132 L218 146 L180 226" fill="#FCFCFD" fill-opacity="0.6" />
      <!-- Front Closure & Single Horn Button -->
      <line x1="180" y1="226" x2="180" y2="326" />
      <circle cx="180" cy="236" r="4" fill="${INK}" />
      <!-- Chest Welt & Flap Pockets -->
      <line x1="202" y1="158" x2="228" y2="154" stroke="${INK}" stroke-width="1.3" />
      <path d="M124 268 H162 V280 H124 Z" fill="#FCFCFD" fill-opacity="0.55" />
      <path d="M198 268 H236 V280 H198 Z" fill="#FCFCFD" fill-opacity="0.55" />
      <!-- Tailoring Darts & Shoulder Seams -->
      <path d="M144 176 L142 252 M216 176 L218 252" stroke="${SEAM}" stroke-width="0.9" stroke-dasharray="3 3" />
      <path d="M92 96 Q110 124 114 156 M268 96 Q250 124 246 156" fill="none" stroke="${SEAM}" stroke-width="0.95" />
    </g>
  `,

  'merino-cardigan': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Cropped Fine-Gauge Cardigan -->
      <path d="M148 92 Q180 112 212 92 L258 110 L288 262 L262 268 L242 162 L240 296 L120 296 L118 162 L98 268 L72 262 L102 110 Z" fill="${fill}" />
      <!-- Ribbed Collar, Placket, Hem & Cuffs -->
      <path d="M144 96 Q180 120 216 96" fill="none" stroke="${SEAM}" stroke-width="1.1" />
      <rect x="174" y="106" width="12" height="190" fill="#FCFCFD" fill-opacity="0.6" stroke="${SEAM}" stroke-width="0.95" />
      <rect x="120" y="280" width="120" height="16" fill="#FCFCFD" fill-opacity="0.55" stroke="${SEAM}" stroke-width="0.95" />
      <path d="M75 248 L101 254 L98 268 L72 262 Z M285 248 L259 254 L262 268 L288 262 Z" fill="#FCFCFD" fill-opacity="0.55" stroke="${SEAM}" stroke-width="0.95" />
      <!-- Fine Rib Hatches along Hem -->
      <g stroke="${SEAM}" stroke-width="0.7" opacity="0.7">
        <line x1="132" y1="281" x2="132" y2="295" />
        <line x1="146" y1="281" x2="146" y2="295" />
        <line x1="160" y1="281" x2="160" y2="295" />
        <line x1="200" y1="281" x2="200" y2="295" />
        <line x1="214" y1="281" x2="214" y2="295" />
        <line x1="228" y1="281" x2="228" y2="295" />
      </g>
      <!-- 5 Matte Tonal Buttons -->
      <g fill="${INK}" stroke="none">
        <circle cx="180" cy="126" r="2.7" />
        <circle cx="180" cy="160" r="2.7" />
        <circle cx="180" cy="194" r="2.7" />
        <circle cx="180" cy="228" r="2.7" />
        <circle cx="180" cy="262" r="2.7" />
      </g>
      <!-- Armhole Fashioning Marks -->
      <path d="M102 110 Q116 136 118 162 M258 110 Q244 136 242 162" fill="none" stroke="${SEAM}" stroke-width="0.9" stroke-dasharray="2 3" />
    </g>
  `,

  'poplin-shirt': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Slightly Oversized Poplin Shirt -->
      <path d="M152 76 L180 86 L208 76 L264 98 L294 268 L266 274 L246 154 L246 336 Q180 356 114 336 L114 154 L94 274 L66 268 L96 98 Z" fill="${fill}" />
      <!-- Sharp Minimalist Collar & Stand -->
      <path d="M152 76 L142 114 L174 98 L180 86 Z" fill="#FCFCFD" />
      <path d="M208 76 L218 114 L186 98 L180 86 Z" fill="#FCFCFD" />
      <!-- Concealed Placket -->
      <line x1="176" y1="96" x2="176" y2="345" stroke="${SEAM}" stroke-width="0.95" />
      <line x1="184" y1="96" x2="184" y2="345" stroke="${SEAM}" stroke-width="0.85" stroke-dasharray="3 3" />
      <!-- Structured Wide Cuffs -->
      <path d="M70 248 L98 254 L94 274 L66 268 Z M290 248 L262 254 L266 274 L294 268 Z" fill="#FCFCFD" fill-opacity="0.7" />
      <!-- Shoulder Yoke & Side Gusset Hint -->
      <path d="M96 98 L114 154 M264 98 L246 154" stroke="${SEAM}" stroke-width="0.95" />
      <line x1="114" y1="124" x2="246" y2="124" stroke="${SEAM}" stroke-width="0.75" stroke-dasharray="3 4" />
    </g>
  `,

  'rib-turtleneck': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Slim Mock-Neck Knit -->
      <path d="M154 72 H206 V100 L254 114 L284 282 L260 286 L236 160 L232 326 H128 L124 160 L100 286 L76 282 L106 114 L154 100 Z" fill="${fill}" />
      <line x1="154" y1="98" x2="206" y2="98" stroke="${SEAM}" stroke-width="1" />
      <!-- Delicate Vertical Fine-Rib Texture -->
      <g stroke="${SEAM}" stroke-width="0.65" opacity="0.58">
        <line x1="142" y1="112" x2="140" y2="322" />
        <line x1="154" y1="106" x2="154" y2="322" />
        <line x1="167" y1="102" x2="167" y2="322" />
        <line x1="180" y1="102" x2="180" y2="322" />
        <line x1="193" y1="102" x2="193" y2="322" />
        <line x1="206" y1="106" x2="206" y2="322" />
        <line x1="218" y1="112" x2="220" y2="322" />
        <line x1="166" y1="74" x2="166" y2="96" />
        <line x1="180" y1="74" x2="180" y2="96" />
        <line x1="194" y1="74" x2="194" y2="96" />
      </g>
      <path d="M106 114 Q120 138 124 160 M254 114 Q240 138 236 160" fill="none" stroke="${SEAM}" stroke-width="0.9" />
    </g>
  `,

  'pleated-skirt': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- High Structured Waistband -->
      <rect x="128" y="84" width="104" height="22" fill="#FCFCFD" fill-opacity="0.7" />
      <!-- A-Line Knife-Pleated Skirt Body -->
      <path d="M128 106 L82 374 L98 378 L112 374 L128 380 L144 375 L162 381 L180 376 L198 381 L216 375 L232 380 L248 374 L262 378 L278 374 L232 106 Z" fill="${fill}" />
      <!-- Crisp Radiating Knife Pleats -->
      <g stroke="${SEAM}" stroke-width="1">
        <line x1="138" y1="106" x2="98" y2="378" />
        <line x1="148" y1="106" x2="128" y2="380" />
        <line x1="159" y1="106" x2="144" y2="375" />
        <line x1="169" y1="106" x2="162" y2="381" />
        <line x1="180" y1="106" x2="180" y2="376" />
        <line x1="191" y1="106" x2="198" y2="381" />
        <line x1="201" y1="106" x2="216" y2="375" />
        <line x1="212" y1="106" x2="232" y2="380" />
        <line x1="222" y1="106" x2="262" y2="378" />
      </g>
      <line x1="128" y1="95" x2="232" y2="95" stroke="${SEAM}" stroke-width="0.75" stroke-dasharray="3 3" />
    </g>
  `,

  'satin-dress': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Spaghetti Straps -->
      <line x1="138" y1="54" x2="138" y2="108" stroke-width="1.5" />
      <line x1="222" y1="54" x2="222" y2="108" stroke-width="1.5" />
      <!-- Bias-Cut Fluid Satin Slip Silhouette -->
      <path d="M138 108 Q180 132 222 108 L234 148 Q222 198 226 244 L254 398 Q180 412 106 398 L134 244 Q138 198 126 148 Z" fill="${fill}" />
      <!-- Subtle Draped Cowl Fold Lines -->
      <path d="M142 118 Q180 144 218 118" fill="none" stroke="${SEAM}" stroke-width="0.95" />
      <path d="M150 134 Q180 152 210 134" fill="none" stroke="${SEAM}" stroke-width="0.75" opacity="0.75" />
      <!-- Bias Cut 45-degree Grain Indicator -->
      <path d="M164 252 L196 220" stroke="${SEAM}" stroke-width="0.85" stroke-dasharray="3 3" />
      <path d="M189 220 H196 V227" fill="none" stroke="${SEAM}" stroke-width="0.85" />
      <!-- Hem Fluidity Drape -->
      <path d="M136 396 Q158 340 162 292 M224 396 Q202 340 198 292" fill="none" stroke="${SEAM}" stroke-width="0.75" opacity="0.6" />
    </g>
  `,

  'wide-trousers': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- High Waistband -->
      <rect x="122" y="64" width="116" height="22" fill="#FCFCFD" fill-opacity="0.75" />
      <!-- Fluid Double-Pleated Wide Legs -->
      <path d="M122 86 L100 400 L166 400 L180 184 L194 400 L260 400 L238 86 Z" fill="${fill}" />
      <!-- Fly & Belt Loops -->
      <path d="M180 86 V154 Q180 168 172 172" fill="none" stroke="${SEAM}" stroke-width="1" />
      <g stroke="${INK}" stroke-width="1.1">
        <line x1="140" y1="64" x2="140" y2="86" />
        <line x1="220" y1="64" x2="220" y2="86" />
      </g>
      <!-- Double Front Pleats & Pressed Center Crease -->
      <path d="M152 86 L146 138 M164 86 L160 128 M208 86 L214 138 M196 86 L200 128" stroke="${SEAM}" stroke-width="1" />
      <line x1="146" y1="138" x2="133" y2="398" stroke="${SEAM}" stroke-width="0.85" stroke-dasharray="4 3" />
      <line x1="214" y1="138" x2="227" y2="398" stroke="${SEAM}" stroke-width="0.85" stroke-dasharray="4 3" />
      <!-- Slant Side Pockets -->
      <path d="M122 96 L134 148 M238 96 L226 148" stroke="${SEAM}" stroke-width="0.95" />
    </g>
  `,

  'selvedge-denim': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Denim Waistband -->
      <rect x="124" y="66" width="112" height="22" fill="#FCFCFD" fill-opacity="0.65" />
      <circle cx="180" cy="77" r="3.2" fill="none" stroke="${INK}" stroke-width="1.2" />
      <!-- Straight Relaxed Legs -->
      <path d="M124 88 L112 398 L168 398 L180 186 L192 398 L248 398 L236 88 Z" fill="${fill}" />
      <!-- Curved Front Pockets & Coin Pocket -->
      <path d="M124 128 Q150 126 156 88" fill="none" stroke="${SEAM}" stroke-width="1.1" />
      <path d="M236 128 Q210 126 204 88" fill="none" stroke="${SEAM}" stroke-width="1.1" />
      <path d="M214 96 H232 V114 H214 Z" fill="none" stroke="${SEAM}" stroke-width="0.85" />
      <!-- J-Stitch Fly -->
      <path d="M180 88 V156 Q180 168 170 172" fill="none" stroke="${SEAM}" stroke-width="1" />
      <path d="M174 88 V152 Q174 162 167 166" fill="none" stroke="${SEAM}" stroke-width="0.8" stroke-dasharray="2.5 2.5" />
      <!-- Crisp Selvedge Turn-Up Cuffs -->
      <rect x="112" y="376" width="56" height="22" fill="#FCFCFD" fill-opacity="0.72" />
      <rect x="192" y="376" width="56" height="22" fill="#FCFCFD" fill-opacity="0.72" />
      <line x1="116" y1="378" x2="116" y2="396" stroke="${ACCENT}" stroke-width="1.2" />
      <line x1="244" y1="378" x2="244" y2="396" stroke="${ACCENT}" stroke-width="1.2" />
    </g>
  `,

  'leather-tote': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Slender Arched Straps -->
      <path d="M138 178 C138 78, 222 78, 222 178" fill="none" stroke-width="3.2" />
      <path d="M150 178 C150 96, 210 96, 210 178" fill="none" stroke="${SEAM}" stroke-width="1.2" />
      <!-- Architectural Vertical Tote Body -->
      <path d="M104 178 H256 L246 378 H114 Z" fill="${fill}" />
      <!-- Side Gusset Crease Lines -->
      <path d="M122 178 L128 378 M238 178 L232 378" stroke="${SEAM}" stroke-width="0.95" stroke-dasharray="3 3" />
      <!-- Top Collar Seam & Silver Clasp -->
      <line x1="106" y1="194" x2="254" y2="194" stroke="${SEAM}" stroke-width="0.9" />
      <rect x="171" y="182" width="18" height="20" rx="2" fill="#FCFCFD" stroke="${INK}" stroke-width="1.3" />
      <circle cx="180" cy="192" r="2.2" fill="${INK}" />
      <!-- Base Panel Line -->
      <line x1="116" y1="364" x2="244" y2="364" stroke="${SEAM}" stroke-width="0.85" />
    </g>
  `,

  'sculptural-bag': (fill) => `
    <g stroke="${INK}" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round">
      <!-- Clean Sweeping Shoulder Strap -->
      <path d="M88 228 C94 110, 266 110, 272 228" fill="none" stroke-width="3" />
      <!-- Elongated Sculpted Folded-Pleat Baguette Body -->
      <path d="M74 226 Q180 218 286 226 L296 312 Q180 326 64 312 Z" fill="${fill}" />
      <!-- Origami Side Fold Geometry & Minimalist Flap -->
      <path d="M74 226 Q180 274 286 226" fill="#FCFCFD" fill-opacity="0.32" />
      <path d="M76 238 L92 314 M284 238 L268 314" stroke="${SEAM}" stroke-width="1" />
      <path d="M148 258 Q180 264 212 258" fill="none" stroke="${SEAM}" stroke-width="0.95" stroke-dasharray="3 3" />
      <!-- Subtle Hardware Rings -->
      <circle cx="88" cy="228" r="4" fill="#FCFCFD" />
      <circle cx="272" cy="228" r="4" fill="#FCFCFD" />
    </g>
  `
};

/**
 * Renders live cm architectural measurement callouts onto the flat drawing
 */
function dimensionOverlay(product, size) {
  const specs = product.measurements?.[size] || Object.values(product.measurements || {})[0];
  if (!specs) return '';

  const entries = Object.entries(specs);
  const [firstLabel, firstVal] = entries[0] || [];
  const [secondLabel, secondVal] = entries[1] || [];
  const [thirdLabel, thirdVal] = entries[2] || [];

  const isBag = product.category === '包袋配饰';
  const isBottom = product.category === '裤装' || product.category === '裙装与连衣裙';

  // Position arrows naturally based on garment geometry
  const verticalTop = isBag ? 178 : 64;
  const verticalBottom = isBag ? 378 : 394;
  const verticalMid = Math.round((verticalTop + verticalBottom) / 2);

  const horizY = isBag ? 404 : isBottom ? 52 : 44;
  const horizLeft = isBag ? 96 : 108;
  const horizRight = isBag ? 264 : 252;

  return `
    <g class="flat-dimensions" font-family="DM Sans, Noto Sans SC, sans-serif" font-size="10.5" font-weight="500">
      ${firstLabel ? `
        <!-- Primary Vertical Dimension (e.g. 衣长 / 裤长 / 包高) -->
        <g stroke="${ACCENT}" stroke-width="0.9">
          <line x1="316" y1="${verticalTop}" x2="316" y2="${verticalBottom}" />
          <line x1="310" y1="${verticalTop}" x2="322" y2="${verticalTop}" />
          <line x1="310" y1="${verticalBottom}" x2="322" y2="${verticalBottom}" />
        </g>
        <rect x="272" y="${verticalMid - 11}" width="80" height="22" rx="2" fill="#FCFCFD" stroke="${ACCENT}" stroke-width="0.8" />
        <text x="312" y="${verticalMid + 3.5}" text-anchor="middle" fill="${ACCENT}">${firstLabel} ${firstVal}</text>
      ` : ''}

      ${secondLabel ? `
        <!-- Top Horizontal Dimension (e.g. 肩宽 / 腰围 / 包宽) -->
        <g stroke="${INK}" stroke-width="0.85">
          <line x1="${horizLeft}" y1="${horizY}" x2="${horizRight}" y2="${horizY}" />
          <line x1="${horizLeft}" y1="${horizY - 5}" x2="${horizLeft}" y2="${horizY + 5}" />
          <line x1="${horizRight}" y1="${horizY - 5}" x2="${horizRight}" y2="${horizY + 5}" />
        </g>
        <rect x="134" y="${horizY - 11}" width="92" height="20" rx="2" fill="#FCFCFD" stroke="${GUIDE}" stroke-width="0.8" />
        <text x="180" y="${horizY + 2.5}" text-anchor="middle" fill="${INK}">${secondLabel} ${secondVal}</text>
      ` : ''}

      ${thirdLabel ? `
        <!-- Bottom Spec Strip (e.g. 胸围 / 臀围 / 肩带) -->
        <rect x="22" y="422" width="136" height="22" rx="2" fill="#FCFCFD" stroke="${GUIDE}" stroke-width="0.8" />
        <text x="90" y="436.5" text-anchor="middle" fill="${SEAM}">${thirdLabel} ${thirdVal}</text>
      ` : ''}

      <!-- Active Size Stamp -->
      <rect x="22" y="20" width="68" height="22" rx="2" fill="${INK}" />
      <text x="56" y="34.5" text-anchor="middle" fill="#FCFCFD" font-size="10">${size === '均码' ? '均码制版' : `${size} 码制版`}</text>
    </g>
  `;
}

/**
 * Renders a complete standalone SVG markup string for any Sukuo SKU.
 */
export function renderFlatSvg(product, options = {}) {
  const {
    size = product.sizes?.[1] || product.sizes?.[0] || 'M',
    colorHex = product.colors?.[0]?.hex || '#D8DCE2',
    showDimensions = false
  } = options;

  const drawFn = GARMENT_DRAWINGS[product.patternKey] || GARMENT_DRAWINGS['wool-blazer'];
  const fill = hexToSoftTint(colorHex, showDimensions ? 0.16 : 0.24);

  return `
    <svg class="flat-svg" viewBox="0 0 360 460" role="img" aria-label="${product.name} 服装平面款式图" xmlns="http://www.w3.org/2000/svg">
      ${draftingBackdrop(showDimensions)}
      ${drawFn(fill)}
      ${showDimensions ? dimensionOverlay(product, size) : ''}
    </svg>
  `;
}

/**
 * Renders high-precision silhouette structural diagrams for the Silhouette & Fabric Archive section.
 */
export function renderSilhouetteBlueprint(silhouetteId) {
  const drawings = {
    'h-line': `
      <svg class="silhouette-svg" viewBox="0 0 480 320" role="img" aria-label="建筑H型廓形结构图" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#F5F6F8" />
        <g stroke="${GUIDE}" stroke-width="0.75" stroke-dasharray="3 4">
          <line x1="168" y1="32" x2="168" y2="288" />
          <line x1="312" y1="32" x2="312" y2="288" />
          <line x1="240" y1="24" x2="240" y2="296" />
        </g>
        <!-- Crisp Vertical H-Line Architectural Coat Outline -->
        <path d="M204 44 L240 56 L276 44 L324 68 L344 196 L318 200 L306 116 L312 280 H168 L174 116 L162 200 L136 196 L156 68 Z"
              fill="rgba(24,26,31,0.06)" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M204 44 L192 96 L240 158 L288 96 L276 44" fill="none" stroke="${SEAM}" stroke-width="1" />
        <line x1="240" y1="158" x2="240" y2="280" stroke="${INK}" stroke-width="1.2" />
        <!-- Structural Callouts with Balanced Side Margins -->
        <g fill="${ACCENT}" font-family="DM Sans, Noto Sans SC, sans-serif" font-size="11">
          <line x1="316" y1="68" x2="366" y2="68" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="316" cy="68" r="3" />
          <text x="372" y="72">微落肩建筑线</text>

          <line x1="312" y1="184" x2="366" y2="184" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="312" cy="184" r="3" />
          <text x="372" y="188">垂直留量不贴身</text>

          <line x1="168" y1="264" x2="112" y2="264" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="168" cy="264" r="3" />
          <text x="104" y="268" text-anchor="end">利落直筒下摆</text>
        </g>
      </svg>
    `,
    'bias-a': `
      <svg class="silhouette-svg" viewBox="0 0 480 320" role="img" aria-label="斜裁流体A摆结构图" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#F5F6F8" />
        <g stroke="${GUIDE}" stroke-width="0.75" stroke-dasharray="3 4">
          <line x1="240" y1="22" x2="240" y2="296" />
          <line x1="186" y1="264" x2="294" y2="156" />
        </g>
        <!-- Fluid 45-degree Bias Slip / Skirt Silhouette -->
        <line x1="206" y1="42" x2="206" y2="86" stroke="${INK}" stroke-width="1.4" />
        <line x1="274" y1="42" x2="274" y2="86" stroke="${INK}" stroke-width="1.4" />
        <path d="M206 86 Q240 106 274 86 L282 126 Q270 162 278 202 L320 284 Q240 296 160 284 L202 202 Q210 162 198 126 Z"
              fill="rgba(109,29,44,0.11)" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M210 98 Q240 118 270 98" fill="none" stroke="${SEAM}" stroke-width="0.95" />
        <path d="M198 282 Q218 232 224 190 M282 282 Q262 232 256 190" fill="none" stroke="${SEAM}" stroke-width="0.85" />
        <!-- Structural Callouts with Balanced Side Margins -->
        <g fill="${ACCENT}" font-family="DM Sans, Noto Sans SC, sans-serif" font-size="11">
          <line x1="278" y1="154" x2="352" y2="154" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="278" cy="154" r="3" />
          <text x="358" y="158">45° 斜丝自然垂坠</text>

          <line x1="168" y1="274" x2="124" y2="274" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="168" cy="274" r="3" />
          <text x="116" y="278" text-anchor="end">流动 A 摆包容胯型</text>
        </g>
      </svg>
    `,
    'cropped-waist': `
      <svg class="silhouette-svg" viewBox="0 0 480 320" role="img" aria-label="微收腰短廓形结构图" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="320" fill="#F5F6F8" />
        <g stroke="${GUIDE}" stroke-width="0.75" stroke-dasharray="3 4">
          <line x1="124" y1="218" x2="356" y2="218" />
          <line x1="240" y1="28" x2="240" y2="294" />
        </g>
        <!-- Cropped Short Jacket / Cardigan Over High-Waist Ratio -->
        <path d="M204 58 Q240 78 276 58 L322 78 L344 198 L318 204 L298 122 L294 218 H186 L182 122 L162 204 L136 198 L158 78 Z"
              fill="rgba(24,26,31,0.07)" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" />
        <rect x="186" y="204" width="108" height="14" fill="#FCFCFD" stroke="${SEAM}" stroke-width="0.95" />
        <!-- Ghost Lower High-Waist Extension Guide -->
        <path d="M188 218 L172 292 M292 218 L308 292" stroke="${GUIDE}" stroke-width="1.1" stroke-dasharray="4 4" />
        <g fill="${ACCENT}" font-family="DM Sans, Noto Sans SC, sans-serif" font-size="11">
          <line x1="296" y1="211" x2="356" y2="211" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="296" cy="211" r="3" />
          <text x="362" y="215">高腰黄金分割线</text>

          <line x1="158" y1="88" x2="116" y2="88" stroke="${ACCENT}" stroke-width="0.9" />
          <circle cx="158" cy="88" r="3" />
          <text x="108" y="92" text-anchor="end">轻盈比例适合叠穿</text>
        </g>
      </svg>
    `
  };

  return drawings[silhouetteId] || drawings['h-line'];
}
