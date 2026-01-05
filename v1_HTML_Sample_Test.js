// --- Configuration: Premium Minimalist Theme ---
const theme = {
  bg: "#f4f4f4",
  cardBg: "#ffffff",
  textMain: "#111111",
  textBody: "#333333",
  textSec: "#555555",
  textMuted: "#777777",
  accent: "#0B5FFF",      // Deep blue (single accent)
  border: "#e9e9e9",
  footerBg: "#f7f7f7"
};

// 1. Get Input Data
const markdownInput = items[0].json.text || '';

// 2. Parser Engine (Robust Regex)
function parseArticles(markdown) {
  const results = [];
  const rawItems = markdown.split(/\*\*Headline\*\*:/i).slice(1);

  rawItems.forEach(raw => {
    const headline = (raw.match(/^(.*?)(?=\n|\*\*Source)/s) || [])[1];
    const source = (raw.match(/\*\*Source\*\*:\s*(.*?)(?=\n|\*\*Summary)/i) || [])[1];
    const summary = (raw.match(/\*\*Summary\*\*:\s*(.*?)(?=\n|\*\*Link)/i) || [])[1];
    const linkMatch = raw.match(/\*\*Link\*\*:\s*(?:(?:\[.*?\]\((.*?)\))|(https?:\/\/[^\s]+))/i);
    const link = linkMatch ? (linkMatch[1] || linkMatch[2]) : null;

    if (headline && link) {
      results.push({
        headline: headline.trim(),
        source: source ? source.trim().toUpperCase() : 'NEWS',
        summary: summary ? summary.trim() : '',
        link: link.trim()
      });
    }
  });

  return results;
}

// 3. Process Data
const articles = parseArticles(markdownInput);
const date = new Date();
const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
const dateStr = date.toLocaleDateString('en-US', dateOptions);

let emailContent = '';

if (articles.length > 0) {
  const hero = articles[0];

  // --- HERO CARD ---
  const heroHtml = `
    <tr>
      <td class="mobile-pad" style="padding: 28px 34px 10px 34px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
          style="background-color: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
          <tr>
            <td style="padding: 26px 26px 22px 26px;">
              <p style="margin: 0 0 10px 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; color: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                Top Story
              </p>

              <h2 style="margin: 0 0 14px 0; font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; line-height: 1.25; color: ${theme.textMain};">
                <a href="${hero.link}" style="color: ${theme.textMain}; text-decoration: none;">
                  ${hero.headline}
                </a>
              </h2>

              <p style="margin: 0 0 18px 0; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.65; color: ${theme.textBody};">
                ${hero.summary}
              </p>

              <!-- CTA (bulletproof-ish button) -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0;">
                <tr>
                  <td style="border-radius: 6px;" bgcolor="${theme.accent}">
                    <a href="${hero.link}"
                      style="display: inline-block; padding: 11px 14px; font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      Read full story →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: ${theme.textMuted}; letter-spacing: 0.4px;">
                ${hero.source}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  // --- IN BRIEF (CARD PER ITEM) ---
  const others = articles.slice(1);

  const listHtml = others.map(item => `
    <tr>
      <td class="mobile-pad" style="padding: 0 34px 14px 34px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
          style="background-color: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
          <tr>
            <td style="padding: 18px 20px;">
              <h3 style="margin: 0 0 8px 0; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; line-height: 1.35; color: ${theme.textMain};">
                <a href="${item.link}" style="color: ${theme.textMain}; text-decoration: none;">
                  ${item.headline}
                </a>
              </h3>

              <p style="margin: 0 0 10px 0; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${theme.textBody};">
                ${item.summary}
              </p>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; color: ${theme.textMuted}; letter-spacing: 0.6px;">
                    ${item.source}
                  </td>
                  <td align="right" style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700;">
                    <a href="${item.link}" style="color: ${theme.accent}; text-decoration: none;">
                      Read →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const sectionLabel = others.length
    ? `
      <tr>
        <td class="mobile-pad" style="padding: 10px 34px 12px 34px;">
          <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 800; color: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">
            In Brief
          </p>
        </td>
      </tr>
    `
    : '';

  emailContent = heroHtml + sectionLabel + listHtml + `
    <tr>
      <td style="height: 8px; line-height: 8px; font-size: 8px;">&nbsp;</td>
    </tr>
  `;
} else {
  emailContent = `
    <tr>
      <td class="mobile-pad" style="padding: 28px 34px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
          style="background-color: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px;">
          <tr>
            <td style="padding: 26px; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${theme.textMuted}; text-align: center;">
              No updates available today.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

// 4. Assemble Final HTML
const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Flux - The Daily Brief</title>
<style>
  /* Client-specific resets */
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; }
  table { border-collapse: collapse; }
  /* Mobile Styles */
  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; }
    .mobile-pad { padding-left: 18px !important; padding-right: 18px !important; }
    .h1 { font-size: 28px !important; }
    .preheader-pad { padding-left: 18px !important; padding-right: 18px !important; }
  }
</style>
</head>

<body style="margin: 0; padding: 0; background-color: ${theme.bg}; font-family: Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${theme.textMain};">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; mso-hide:all;">
    Your daily AI briefing — ${dateStr}.
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.bg};">
    <tr>
      <td align="center" style="padding: 32px 12px;">

        <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0"
          style="width: 600px; max-width: 600px; background-color: ${theme.bg};">

          <!-- Header Card -->
          <tr>
            <td class="mobile-pad" style="padding: 0 34px 16px 34px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                style="background-color: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 22px 24px;">
                    <p style="margin: 0 0 10px 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: ${theme.textMuted};">
                      ${dateStr} • Daily Intelligence
                    </p>

                    <h1 class="h1" style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 34px; font-weight: 900; letter-spacing: -0.8px; line-height: 1.05; color: ${theme.textMain};">
                      AI FLUX<span style="color: ${theme.accent};">.</span>
                    </h1>

                    <p style="margin: 10px 0 0 0; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${theme.textBody};">
                      Clean, text-forward updates — built for fast reading.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          ${emailContent}

          <!-- Footer -->
          <tr>
            <td class="mobile-pad" style="padding: 12px 34px 0 34px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                style="background-color: ${theme.footerBg}; border: 1px solid ${theme.border}; border-radius: 10px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <p style="margin: 0 0 6px 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 800; color: ${theme.textMain};">
                      AI FLUX
                    </p>

                    <p style="margin: 0; font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.55; color: ${theme.textMuted};">
                      Automated Intelligence Briefing.<br>
                      <a href="#" style="color: ${theme.accent}; text-decoration: none; font-weight: 700;">Unsubscribe</a>
                      <span style="color: ${theme.textMuted};"> • </span>
                      <a href="#" style="color: ${theme.accent}; text-decoration: none; font-weight: 700;">Preferences</a>
                    </p>

                    <p style="margin: 10px 0 0 0; font-family: Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.5; color: ${theme.textMuted};">
                      If this email looks off in Outlook, it’s still safe to read — just less pretty.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="height: 18px; line-height: 18px; font-size: 18px;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

return [{ json: { emailBodyHtml: finalHtml } }];
