-- ============================================
-- Sample Data for UnfakeNews
-- ใช้ SQL นี้ใน Supabase SQL Editor
-- ============================================

-- 1. สร้าง Admin User
INSERT INTO "User" (id, email, name, role, "emailVerified", image, "createdAt", "updatedAt")
VALUES (
  'admin_001',
  'admin@unfakenews.com',
  'Admin User',
  'admin',
  NOW(),
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. สร้าง Editor User
INSERT INTO "User" (id, email, name, role, "emailVerified", image, "createdAt", "updatedAt")
VALUES (
  'editor_001',
  'editor@unfakenews.com',
  'Sarah Johnson',
  'user',
  NOW(),
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. สร้าง Post #1: Technology News
INSERT INTO "Post" (id, slug, "authorId", category, image, published, featured, views, "createdAt", "updatedAt")
VALUES (
  'post_tech_001',
  'global-tech-summit-ai-platform',
  'editor_001',
  'Technology',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
  true,
  true,
  0,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- PostTranslation (English) for Post #1
INSERT INTO "PostTranslation" (id, "postId", lang, title, content, excerpt, "seoTitle", "seoDesc", "readTime", "createdAt", "updatedAt")
VALUES (
  'trans_tech_001_en',
  'post_tech_001',
  'en',
  'Global Tech Summit Unveils Revolutionary AI Platform',
  '<p>The annual Global Tech Summit concluded today with the unveiling of several groundbreaking artificial intelligence platforms that industry experts say will fundamentally reshape how we interact with technology.</p>

<p>Leading technology companies from around the world gathered at the summit to showcase their latest innovations in AI, machine learning, and automation. The event attracted over 10,000 attendees, including executives, developers, and investors.</p>

<h2>Revolutionary AI Platform</h2>

<p>The highlight of the summit was the introduction of a new AI platform that promises to democratize access to advanced machine learning capabilities. The platform, developed through a collaboration between several major tech firms, offers unprecedented processing power and ease of use.</p>

<p>"This represents a significant leap forward in making AI accessible to businesses of all sizes," said Dr. Sarah Chen, Chief Technology Officer at TechVentures Inc. "We''re not just talking about incremental improvements – this is a fundamental shift in how AI can be deployed and utilized."</p>

<h2>Industry Impact</h2>

<p>Analysts predict that the new technologies unveiled at the summit will have far-reaching implications across multiple industries, from healthcare to finance to manufacturing. Early adopters are already reporting significant improvements in efficiency and decision-making capabilities.</p>

<p>The summit also featured panel discussions on AI ethics, data privacy, and the future of work in an increasingly automated world. These conversations highlighted the industry''s growing awareness of the need to balance innovation with responsibility.</p>

<h2>Looking Ahead</h2>

<p>As the summit concluded, organizers announced plans for next year''s event, which will focus on practical implementations and case studies from early adopters of this year''s unveiled technologies. The tech community is already buzzing with anticipation for what''s to come.</p>',
  'Industry leaders gather to showcase groundbreaking artificial intelligence technologies that promise to reshape the digital landscape.',
  'Global Tech Summit 2026 | AI Platform Launch | UnfakeNews',
  'Annual Global Tech Summit unveils revolutionary AI platform. Industry leaders showcase breakthrough technologies reshaping digital landscape. Get the latest tech news and insights.',
  '5 min read',
  NOW(),
  NOW()
) ON CONFLICT ("postId", lang) DO NOTHING;

-- 4. สร้าง Post #2: Business News
INSERT INTO "Post" (id, slug, "authorId", category, image, published, featured, views, "createdAt", "updatedAt")
VALUES (
  'post_business_001',
  'economic-recovery-strong-momentum',
  'editor_001',
  'Business',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop',
  true,
  true,
  0,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- PostTranslation (English) for Post #2
INSERT INTO "PostTranslation" (id, "postId", lang, title, content, excerpt, "seoTitle", "seoDesc", "readTime", "createdAt", "updatedAt")
VALUES (
  'trans_business_001_en',
  'post_business_001',
  'en',
  'Economic Recovery Shows Strong Momentum in Q1',
  '<p>The global economy is showing robust signs of recovery in the first quarter, with multiple sectors reporting strong growth indicators that exceed earlier predictions.</p>

<h2>Key Economic Indicators</h2>

<p>Latest economic data reveals significant improvements across various sectors. Manufacturing output has increased by 4.2%, while the services sector saw a 3.8% growth compared to the previous quarter. Consumer confidence reached its highest level in two years, signaling renewed optimism about economic prospects.</p>

<h2>Market Response</h2>

<p>Financial markets have responded positively to the economic data, with major indices showing sustained growth. Investors are increasingly confident about the stability of the recovery, leading to increased capital flows into emerging markets.</p>

<p>Central banks worldwide are carefully monitoring these developments, with some beginning to adjust monetary policies in response to the strengthening economic conditions.</p>

<h2>Expert Analysis</h2>

<p>"We''re seeing a broad-based recovery that touches multiple sectors," explained Dr. Michael Torres, Chief Economist at Global Financial Institute. "The strength and consistency of these indicators suggest this is not a temporary bounce but a sustainable trajectory."</p>

<p>However, experts caution that challenges remain, including supply chain disruptions and geopolitical uncertainties that could impact future growth.</p>',
  'Latest economic indicators suggest robust growth across multiple sectors, exceeding earlier predictions for Q1 recovery.',
  'Economic Recovery Q1 2026 | Strong Growth Indicators | Business News',
  'Global economy shows strong Q1 recovery with robust growth across sectors. Latest economic indicators, market analysis, and expert insights on sustainable economic trajectory.',
  '4 min read',
  NOW(),
  NOW()
) ON CONFLICT ("postId", lang) DO NOTHING;

-- 5. สร้าง Post #3: Politics/Climate
INSERT INTO "Post" (id, slug, "authorId", category, image, published, featured, views, "createdAt", "updatedAt")
VALUES (
  'post_politics_001',
  'climate-action-summit-bold-targets',
  'admin_001',
  'Politics',
  'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=1200&h=800&fit=crop',
  true,
  true,
  0,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- PostTranslation (English) for Post #3
INSERT INTO "PostTranslation" (id, "postId", lang, title, content, excerpt, "seoTitle", "seoDesc", "readTime", "createdAt", "updatedAt")
VALUES (
  'trans_politics_001_en',
  'post_politics_001',
  'en',
  'Climate Action Summit: Nations Commit to Bold Targets',
  '<p>World leaders concluded the International Climate Action Summit with unprecedented commitments to reduce carbon emissions and accelerate the transition to renewable energy sources.</p>

<h2>Historic Agreements</h2>

<p>The summit resulted in binding agreements from 157 nations to achieve net-zero emissions by 2050, with intermediate targets set for 2030 and 2040. This represents the most comprehensive global climate commitment to date.</p>

<p>Developed nations pledged $200 billion in climate finance to support developing countries in their transition to clean energy, marking a significant increase from previous commitments.</p>

<h2>Renewable Energy Transition</h2>

<p>Key provisions include accelerated investment in renewable energy infrastructure, with targets set for solar, wind, and emerging technologies. Participating nations committed to phasing out coal power by 2035, with exceptions for countries requiring longer transition periods.</p>

<p>"This summit marks a turning point in our collective response to climate change," stated UN Secretary-General Maria Santos. "The commitments made here demonstrate genuine political will to address this existential challenge."</p>

<h2>Implementation and Monitoring</h2>

<p>A new international monitoring framework will track progress on emissions reductions and renewable energy adoption. Nations will report annually on their achievements and adjust targets based on scientific recommendations.</p>

<p>Environmental organizations cautiously welcomed the agreements while emphasizing the need for rapid implementation and accountability mechanisms to ensure targets are met.</p>',
  'World leaders announce ambitious plans to combat climate change with binding emissions targets and renewable energy commitments.',
  'Climate Action Summit 2026 | Bold Emission Targets | Political News',
  'International Climate Action Summit concludes with historic agreements. 157 nations commit to net-zero emissions by 2050. Latest climate policy news and analysis.',
  '6 min read',
  NOW(),
  NOW()
) ON CONFLICT ("postId", lang) DO NOTHING;

-- 6. สร้าง Post #4: Culture
INSERT INTO "Post" (id, slug, "authorId", category, image, published, featured, views, "createdAt", "updatedAt")
VALUES (
  'post_culture_001',
  'cultural-renaissance-new-museum-downtown',
  'editor_001',
  'Culture',
  'https://images.unsplash.com/photo-1565306049090-e5f2c4c8a2b5?w=1200&h=800&fit=crop',
  true,
  false,
  0,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- PostTranslation (English) for Post #4
INSERT INTO "PostTranslation" (id, "postId", lang, title, content, excerpt, "seoTitle", "seoDesc", "readTime", "createdAt", "updatedAt")
VALUES (
  'trans_culture_001_en',
  'post_culture_001',
  'en',
  'Cultural Renaissance: New Museum Opens Downtown',
  '<p>The city''s downtown district welcomed a stunning new contemporary art museum, marking a significant milestone in the region''s cultural development and urban renewal efforts.</p>

<h2>Architectural Marvel</h2>

<p>Designed by renowned architect Elena Rodriguez, the museum features a striking blend of modern design and sustainable architecture. The building''s innovative use of natural light and interactive spaces creates an immersive experience for visitors.</p>

<p>The facility spans 150,000 square feet across five floors, housing permanent collections, temporary exhibitions, and innovative interactive installations that merge art with technology.</p>

<h2>Opening Exhibitions</h2>

<p>The inaugural exhibition showcases works from emerging contemporary artists alongside pieces from established masters. Interactive digital installations allow visitors to engage with art in unprecedented ways, including virtual reality experiences and AI-generated artworks.</p>

<p>"We''re reimagining what a museum can be in the 21st century," explained Museum Director James Chen. "This isn''t just about displaying art – it''s about creating dialogues and experiences that resonate with diverse audiences."</p>

<h2>Community Impact</h2>

<p>The museum''s opening is expected to catalyze further cultural and economic development in the downtown area. Free admission programs and educational initiatives aim to make art accessible to all community members.</p>',
  'State-of-the-art facility celebrates contemporary art with interactive exhibitions and innovative architectural design.',
  'New Contemporary Art Museum Downtown | Cultural News',
  'Stunning new contemporary art museum opens downtown featuring interactive exhibitions and sustainable architecture. Explore the future of cultural spaces.',
  '3 min read',
  NOW(),
  NOW()
) ON CONFLICT ("postId", lang) DO NOTHING;

-- ============================================
-- ตรวจสอบผลลัพธ์
-- ============================================

-- Count records
SELECT 'Users' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Posts' as table_name, COUNT(*) as count FROM "Post"
UNION ALL
SELECT 'Translations' as table_name, COUNT(*) as count FROM "PostTranslation";

-- Show all posts with their translations
SELECT 
  p.slug,
  p.category,
  p.published,
  p.featured,
  COUNT(pt.id) as translation_count
FROM "Post" p
LEFT JOIN "PostTranslation" pt ON p.id = pt."postId"
GROUP BY p.id, p.slug, p.category, p.published, p.featured
ORDER BY p."createdAt" DESC;
