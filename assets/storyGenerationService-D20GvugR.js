import{b as i,O as S}from"./index-DgvGgdq2.js";let d=null;async function f(){if(d)return d;let e=null;try{const o=await i.get("/aipreneur/system/openai-key");o.success&&o.api_key&&(e=o.api_key)}catch{}if(e||(e=void 0),!e||e.trim()==="")throw new Error("OpenAI API key not configured. Please add it in Admin Settings.");return console.log("🔑 Initializing OpenAI client with API key:",e.substring(0,20)+"..."),d=new S({apiKey:e.trim(),dangerouslyAllowBrowser:!0}),d}async function w(){try{const e=await i.get("/aipreneur/system/ai-model");if(e.success&&e.model)return e.model}catch{}return"gpt-4o-mini"}const m="story_sessions";function u(){try{return JSON.parse(localStorage.getItem(m)||"{}")}catch{return{}}}function b(e){const o=u();o[e.session_id]=e,localStorage.setItem(m,JSON.stringify(o))}const I=async e=>{var s,l,c,g;const o=e.answers.map((a,t)=>`Q${t+1}: ${a.answer_code}`).join(`
`),n=`You are an AI storytelling engine for children. Generate a personalized 10-page interactive storybook.

CHILD INFO:
- Name: ${e.genius_name}
- Age: ${e.age}
- Gender: ${e.gender}
- Learning Style: ${e.learning_style}
- Behaviour: ${e.behaviour_tendency}
- Curiosity: ${e.curiosity_type}

CHAPTER: ${e.chapter_title} (Theme: ${e.chapter_theme})

PERSONALIZATION ANSWERS:
${o}

Generate a JSON response with exactly this structure:
{
  "titles": ["4 story title options - each MUST include the child's name ${e.genius_name}"],
  "pages": [
    {
      "page_index": 1,
      "page_type": "activity" or "quiz",
      "intro_text": "engaging story text for this page (2-3 sentences)",
      "activity_prompt_photo": "if activity: instruction for photo/art activity",
      "activity_requires_photo": true/false,
      "activity_prompt_question": "if quiz: the question",
      "question_id": "if quiz: unique id",
      "options": ["if quiz: 4 answer options"],
      "result_text_template": "short continuation text (1-2 sentences)"
    }
    ... 10 pages total, mix of activity and quiz pages
  ]
}

RULES:
- Each title MUST include "${e.genius_name}"
- Alternate between activity and quiz pages
- Keep text appropriate for age ${e.age}
- Make it exciting and educational
- Each page builds on the story
- Return ONLY valid JSON, no markdown`;try{console.log("📖 Starting story generation for chapter:",e.chapter_code);const a=await f(),t=await w();console.log("🤖 Using model:",t);const r=await a.chat.completions.create({model:t,messages:[{role:"user",content:n}],response_format:{type:"json_object"},temperature:.8}),h=r.choices[0].message.content,_=((s=r.usage)==null?void 0:s.total_tokens)||0;if(console.log("✅ OpenAI response received. Tokens used:",_),!h)throw new Error("No content generated from OpenAI");const p=JSON.parse(h);console.log("📚 Story data parsed successfully. Title options:",(l=p.titles)==null?void 0:l.length);const y=crypto.randomUUID(),k={session_id:y,chapter_code:e.chapter_code,chapter_title:e.chapter_title,chapter_theme:e.chapter_theme,genius_name:e.genius_name,age:e.age,gender:e.gender,titles:p.titles,pages:p.pages};console.log("💾 Saving story session...");try{await i.post("/aipreneur/story-sessions",{session_id:y,genius_profile_id:e.genius_profile_id,chapter_code:e.chapter_code,chapter_title:e.chapter_title,chapter_theme:e.chapter_theme,genius_name:e.genius_name,age:e.age,gender:e.gender,titles:p.titles,pages:p.pages})}catch{b(k)}console.log("✅ Story session saved successfully");try{await i.post("/aipreneur/ai/usage-log",{genius_profile_id:e.genius_profile_id,tokens_used:_,purpose:"story_generation"})}catch{}return{session_id:y,story_session:k,tokens_used:_}}catch(a){const t=a;throw console.error("❌ Story generation error:",t),(c=t.message)!=null&&c.includes("API key")?(console.error("🔑 API key issue detected"),new Error("OpenAI API key is not configured properly. Please check Admin Settings.")):(g=t.message)!=null&&g.includes("quota")?(console.error("💳 API quota issue detected"),new Error("OpenAI API quota exceeded. Please check your API usage.")):(console.error("🔍 Full error details:",t),new Error(t.message||"An unexpected error occurred during story generation. Please try again."))}},A=async e=>{var n;const o=`Generate a back cover summary and author blurb for a children's storybook.

STORY INFO:
- Title: ${e.selected_title}
- Chapter: ${e.chapter_title}
- Child: ${e.genius_name}, age ${e.age}, ${e.gender}

Generate a JSON response:
{
  "backcover_summary": "3-4 sentence summary appropriate for a book back cover, exciting and inviting",
  "backcover_author_text": "2-3 sentences about the author (the child) highlighting their creativity and uniqueness"
}

Return ONLY valid JSON, no markdown`;try{const s=await f(),l=await w(),c=await s.chat.completions.create({model:l,messages:[{role:"user",content:o}],response_format:{type:"json_object"},temperature:.7}),g=c.choices[0].message.content,a=((n=c.usage)==null?void 0:n.total_tokens)||0;if(!g)throw new Error("No content generated");const t=JSON.parse(g);try{await i.put(`/aipreneur/story-sessions/${e.session_id}`,{backcover_summary:t.backcover_summary,backcover_author_text:t.backcover_author_text})}catch{const r=u();r[e.session_id]&&(r[e.session_id].backcover_summary=t.backcover_summary,r[e.session_id].backcover_author_text=t.backcover_author_text,localStorage.setItem(m,JSON.stringify(r)))}try{await i.post("/aipreneur/ai/usage-log",{genius_profile_id:e.genius_profile_id,tokens_used:a,purpose:"story_generation"})}catch{}return{backcover_summary:t.backcover_summary,backcover_author_text:t.backcover_author_text,tokens_used:a}}catch(s){throw console.error("Backcover generation error:",s),s}},O=async e=>{try{const n=await i.get(`/aipreneur/story-sessions/${e}`);if(n.success&&n.session)return n.session}catch{}return u()[e]||null},$=async(e,o)=>{try{await i.put(`/aipreneur/story-sessions/${e}`,o);return}catch{}const n=u();n[e]&&(n[e]={...n[e],...o},localStorage.setItem(m,JSON.stringify(n)))},x=async(e,o)=>{var s,l,c,g;const n=`Using this uploaded image, generate a story page of: ${e.intro_text} ${e.result_text}

Ensure the uploaded image is improved into the story; yet still recognizable.

CHARACTER: ${e.genius_name}, a ${e.age}-year-old ${e.gender}
THEME: ${e.chapter_theme}
PAGE: ${e.page_index+1}

Create a colorful, whimsical storybook illustration that:
- Features ${e.genius_name} as the main character
- Captures the magical moment described in the story
- Uses a warm, inviting, child-friendly art style
- Is age-appropriate and positive
- Has clear composition with ${e.genius_name} as the focal point
- Looks like it belongs in a premium children's book
- Incorporates recognizable elements from the uploaded image
- Style: digital illustration, vibrant colors, storybook art, watercolor-inspired

Make it enchanting and memorable! Ensure the image is as what attached, make sure there is no text or font in the whole image and image should be ready image that I can print as storybook page.`;try{console.log("🎨 Starting image generation for page:",e.page_index),console.log("📸 Has uploaded image:",!!e.uploaded_image_base64);const a=await f();let t;const r=1e3;if(console.log("🖼️ Using gpt-image-1-mini for image generation"),t=(s=(await a.images.generate({model:"gpt-image-1-mini",prompt:n,size:"1024x1024",n:1})).data[0])==null?void 0:s.url,!t)throw new Error("No image URL returned from OpenAI");console.log("✅ Image generated successfully");try{await i.post("/aipreneur/ai/usage-log",{genius_profile_id:o,tokens_used:r,purpose:"image_generation"})}catch{}return{image_url:t,tokens_used:r}}catch(a){const t=a;throw console.error("❌ Image generation error:",t),(l=t.message)!=null&&l.includes("API key")?new Error("OpenAI API key is not configured properly. Please check Admin Settings."):(c=t.message)!=null&&c.includes("quota")||(g=t.message)!=null&&g.includes("billing")?new Error("OpenAI API quota exceeded. Please check your API usage."):new Error(t.message||"Failed to generate image. Please try again.")}};export{O as a,x as b,A as c,I as g,$ as u};
