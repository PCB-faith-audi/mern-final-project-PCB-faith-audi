import Parser from "rss-parser";

const parser = new Parser({
  headers: { "User-Agent": "EcoPulseBot/1.0 (+https://ecopulse.app)" },
});

const FEEDS = [
  "https://news.google.com/rss/search?q=climate%20change&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=renewable%20energy&hl=en-US&gl=US&ceid=US:en",
];

function extractImage(item) {
  return (
    item.enclosure?.url ||
    item.enclosures?.[0]?.url ||
    item["media:content"]?.$?.url ||
    undefined
  );
}

export async function getLatest(req, res) {
  try {
    const all = [];
    for (const url of FEEDS) {
      const feed = await parser.parseURL(url);
      for (const it of feed.items.slice(0, 10)) {
        all.push({
          title: it.title,
          link: it.link,
          pubDate: it.pubDate || it.isoDate || null,
          source: feed.title,
          image: extractImage(it),
          snippet: it.contentSnippet || it.content || "",
        });
      }
    }
    const map = new Map();
    for (const n of all) if (!map.has(n.title)) map.set(n.title, n);
    const items = Array.from(map.values()).slice(0, 18);
    res.json({ items });
  } catch {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}