/* =====================================================================
   EXPERIENCE PAGE DATA. This is the only part you need to edit.

   Add an experience: copy one whole { ... } block, paste it after a
   comma, and change the values.

   Photos: save your pictures in a folder called  images  next to the
   html files, then list them in "photos" (2 or more is best).
     { src: "images/my-photo.jpg", caption: "What the photo shows" }
   Until a file exists, a labelled box shows the file name to use.

   type examples: Internship, Volunteer, Part-time, Project, Leadership
   ===================================================================== */

var EXPERIENCE = [
  {
    role: "Role title",
    organization: "Organization name",
    type: "Internship",
    period: "Mon 2026 - Mon 2026",
    location: "City, Sri Lanka",
    summary: "Placeholder: describe the experience in one or two sentences. Say what the team did and what your part was.",
    points: [
      "Placeholder: something you built, fixed or organised, with a result if you have one.",
      "Placeholder: tools you used, team size or responsibilities."
    ],
    skills: ["Python", "Teamwork"],
    photos: [
      { src: "images/experience-1-photo-1.jpg", caption: "Add a caption for this photo" },
      { src: "images/experience-1-photo-2.jpg", caption: "Add a caption for this photo" },
      { src: "images/experience-1-photo-3.jpg", caption: "Add a caption for this photo" }
    ],
    link: ""
  },
  {
    role: "Member - Documentation Team (CodeSplash)",
    organization: "Computer Science Students' Association in University of Kelaniya",
    type: "Volunteer",
    period: "April 2025 - Sep 2025",
    location: "Kelaniya, Sri Lanka",
    summary: "CodeSplash’26 is an all-island inter-school ideathon and inter-university hackathon organized by the Computer Science Students’ Association (CSSA) of the Faculty of Computing and Technology, University of Kelaniya.",
    points: [
      "Responsible for creating and managing all written content of the event. Handles proposals, reports and final documentation.",
      "Gained experience in content creation by preparing promotional captions, descriptions, and written materials for event promotions and documentation."
    ],
    skills: ["Technical Documentation", "Communication", "Content Writing", "Team Collaboration", "Time Management"],
    photos: [
      { src: "images/experience/p1.jpg", caption: "All Organising Team Members & Competitors" },
      { src: "images/experience/p2.jpg", caption: "Registration by Documentation Team" },
      { src: "images/experience/", caption: "Organization certificate" },
    ],
    link: "https://www.linkedin.com/company/cssauok/posts/?feedView=all",
    link: "https://codesplash.cssa.lk/"
  },
  {
    role: "Member - Paper Marking Panel - Pure Mathematics",
    organization: "Chandana Dahanayake class in Apeiro Education",
    type: "Work Experience",
    period: "Feb 2023 - Nov 2024",
    location: "Matara, Sri Lanka",
    
    points: [
      "The Paper Marking Panel is responsible for evaluating and reviewing answer scripts to ensure accurate, fair, and consistent assessment of students' academic performance."
    ],
    skills: ["Analytical Thinking", "Attention to Detail", "Critical Thinking","Time Management"],
    photos: [
      { src: "images/experience/a1.jpeg", caption: "gift for me " },
      { src: "images/experience/a2.jpeg", caption: "All Paper Panel Team Members" },
      { src: "images/experience/a3.jpeg", caption: "class room" },
    ],
    
  },
];

/* ============================== RENDERING ============================== */
(function () {
  var root = document.getElementById("experience");
  if (!root || !window.PF) return;
  var el = PF.el;

  EXPERIENCE.forEach(function (e) {
    var card = el("article", "exp");

    /* text side */
    var text = el("div", "exp-text");
    var top = el("div", "exp-top");
    if (e.type) top.appendChild(el("span", "badge", e.type));
    if (e.period) top.appendChild(el("span", "meta", e.period));
    text.appendChild(top);
    text.appendChild(el("h3", "", e.role));
    var org = [e.organization, e.location].filter(Boolean).join(" · ");
    if (org) text.appendChild(el("p", "exp-org", org));
    if (e.summary) text.appendChild(el("p", "exp-sum", e.summary));
    if (e.points && e.points.length) {
      var ul = el("ul", "exp-points");
      e.points.forEach(function (p) { ul.appendChild(el("li", "", p)); });
      text.appendChild(ul);
    }
    if (e.skills && e.skills.length) {
      var chips = el("ul", "chips");
      e.skills.forEach(function (s) { chips.appendChild(el("li", "", s)); });
      text.appendChild(chips);
    }
    if (e.link) {
      var links = el("div", "links");
      var a = el("a", "", "Read more ↗");
      a.href = e.link; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
      
      text.appendChild(links);
    }
    card.appendChild(text);

    /* photo side: first photo large, the rest as thumbnails */
    var gallery = el("div", "exp-gallery");
    gallery.setAttribute("data-gallery", "");
    var photos = e.photos || [];
    function add(parent, p, i, cls) {
      var cap = p.caption ? e.role + " · " + p.caption : e.role;
      parent.appendChild(PF.photo(p.src, e.role + ", photo " + (i + 1), cls, cap, "Photo " + (i + 1)));
    }
    function strip(list, from, cols) {
      var row = el("div", "exp-thumbs");
      row.style.setProperty("--cols", cols);
      list.forEach(function (p, i) { add(row, p, from + i, "ethumb"); });
      return row;
    }
    if (photos.length === 1) {
      add(gallery, photos[0], 0, "emain");
    } else if (photos.length === 2) {
      /* two photos sit side by side */
      gallery.appendChild(strip(photos, 0, 2));
    } else if (photos.length >= 3) {
      /* first photo large, the rest as thumbnails (3 per row) */
      add(gallery, photos[0], 0, "emain");
      gallery.appendChild(strip(photos.slice(1), 1, Math.min(photos.length - 1, 3)));
    } else {
      gallery.appendChild(PF.photo("", "", "emain", "", "Add photos"));
    }
    card.appendChild(gallery);
    root.appendChild(card);
  });
})();
