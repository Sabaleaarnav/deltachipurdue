export default async (req, res) => {
  try {
    // Load goals.json from the published site (or keep a hard-coded copy)
    const base = process.env.URL || 'https://example.com';
    const r = await fetch(`${base}/content/goals.json`, { cache: 'no-store' });
    const data = await r.json();
    const out = {};

    // Default: return manual current_amounts
    for (const g of (data.goals || [])) {
      out[g.slug] = Number(g.current_amount || 0);
    }

    // TODO (optional): If you set env secrets (e.g., STRIPE_KEY or GIVEBUTTER_TOKEN),
    // fetch live totals and override out[g.slug] accordingly.

    return res.json(out);
  } catch (e) {
    return res.status(500).json({ error: 'failed to compute totals' });
  }
};
