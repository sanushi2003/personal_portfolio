/* =====================================================================
   ABOUT PAGE DATA. This is the only part you need to edit.

   Add a skill:      copy one line in SKILLS, change the values.
                     level: 1 Beginner, 2 Basic, 3 Intermediate,
                            4 Advanced, 5 Expert
                     A new category creates its own filter button.
   Add education:    copy one block in EDUCATION, change the values.
                     current: true shows the "In progress" badge.
   Everything below "RENDERING" can stay as it is.
   ===================================================================== */

var EDUCATION = [
  {
    degree: "Bachelor of Science (Honours) in Computer Science",
    school: "University of Kelaniya",
    location: "Kelaniya, Sri Lanka",
    period: "4th year",
    current: true,
    summary: "A four-year honours degree covering programming, data structures and algorithms, databases, software engineering, cybersecurity, networking and computer systems, with a focus on building practical, well-tested software.",
    highlights: ["Data structures", "Algorithms", "Object-oriented programming", "Databases", "Web Development", "cybersecurity & AI", "Networking"],
    result: ""
  },
  {
    degree: "G.C.E. Advanced Level",
    school: "MR/Mahindha Rajapaksha Collage",
    location: "Matara, Sri Lanka",
    period: "2020 - 2023",
    current: false,
    summary: "Physical Science stream, Outstanding Academic Achievement.",
    highlights: ["Applied Maths", "Pure Maths", "Chemistry", "Physics"],
    result: "Result: A A B"
  },
  {
    degree: "G.C.E. Ordinary Level",
    school: "MR/Thelijjawila Royal Collage",
    location: "Matara, Sri Lanka",
    period: "2008 - 2019",
    current: false,
    summary: "School Academic Excellence Performance",
    highlights: ["Sinhala", "Mathematics", "Science", "Buddhism", "History", "Civil Education", "Health & Physical Education", "Music", "English"],
    result: "Result: A - 8 / C - 1"
  }
];

var SKILLS = [
  { name: "Python",       category: "Languages", level: 3, note: "Scripts, small tools and coursework projects." },
  { name: "Java",         category: "Languages", level: 3, note: "Object-oriented programming and assignments." },
  { name: "C",            category: "Languages", level: 3, note: "Memory, pointers and low-level basics." },
  { name: "JavaScript",   category: "Languages", level: 3, note: "Interactive pages and simple apps." },
  { name: "SQL",          category: "Languages", level: 3, note: "Queries, joins and database design." },
  { name: "HTML and CSS", category: "Web",       level: 4, note: "Responsive layouts and clean markup." },
  { name: "React",        category: "Web",       level: 2, note: "Components and state in small projects." },
  { name: "Node.js",      category: "Web",       level: 2, note: "Simple servers and REST endpoints." },
  { name: "Git and GitHub", category: "Tools",   level: 3, note: "Branches, commits and pull requests." },
  { name: "Linux",        category: "Tools",     level: 2, note: "Command line and everyday shell use." },
  { name: "VS Code",      category: "Tools",     level: 4, note: "Daily editor, debugging and extensions." },
  { name: "Data structures and algorithms", category: "Core CS", level: 3, note: "Lists, trees, graphs, sorting and searching." },
  { name: "Databases",    category: "Core CS",   level: 2, note: "Relational modelling and normalisation." },
  { name: "PHP",       category: "Languages", level: 3, note: "Dynamic web applications, database integration, and hands-on PHP development projects."},
  

];

/* ============================== RENDERING ============================== */
(function () {
  var LEVELS = ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* Education timeline */
  var eduList = document.getElementById("education");
  if (eduList) {
    EDUCATION.forEach(function (e) {
      var li = el("li", "edu" + (e.current ? " current" : ""));
      li.appendChild(el("div", "edu-when", e.period));
      li.appendChild(el("div", "edu-rail"));

      var card = el("div", "edu-card");
      var head = el("div", "edu-head");
      head.appendChild(el("h3", "", e.degree));
      if (e.current) head.appendChild(el("span", "badge", "In progress"));
      card.appendChild(head);
      card.appendChild(el("p", "edu-school", [e.school, e.location].filter(Boolean).join(" · ")));
      if (e.summary) card.appendChild(el("p", "edu-sum", e.summary));
      if (e.highlights && e.highlights.length) {
        var ul = el("ul", "chips");
        e.highlights.forEach(function (h) { ul.appendChild(el("li", "", h)); });
        card.appendChild(ul);
      }
      if (e.result) card.appendChild(el("p", "edu-result", e.result));
      li.appendChild(card);
      eduList.appendChild(li);
    });
  }

  /* Skill cards with category filter */
  var list = document.getElementById("skills");
  var bar = document.getElementById("skill-filters");
  var count = document.getElementById("skill-count");
  if (!list || !bar) return;

  var cats = [];
  SKILLS.forEach(function (s) { if (cats.indexOf(s.category) < 0) cats.push(s.category); });
  var active = "All";

  SKILLS.forEach(function (s) {
    var lv = Math.max(1, Math.min(5, Math.round(s.level) || 1));
    var li = el("li", "skill");
    li.setAttribute("data-cat", s.category);

    var head = el("div", "skill-head");
    head.appendChild(el("h3", "", s.name));
    head.appendChild(el("span", "cat", s.category));
    li.appendChild(head);
    if (s.note) li.appendChild(el("p", "", s.note));

    var level = el("div", "level");
    var meter = el("span", "meter");
    meter.style.setProperty("--lv", lv);
    meter.setAttribute("role", "img");
    meter.setAttribute("aria-label", LEVELS[lv] + ", " + lv + " of 5");
    level.appendChild(meter);
    level.appendChild(el("span", "lvl", LEVELS[lv]));
    li.appendChild(level);
    list.appendChild(li);
  });

  function apply() {
    var shown = 0;
    Array.prototype.forEach.call(list.children, function (li) {
      var ok = active === "All" || li.getAttribute("data-cat") === active;
      li.hidden = !ok;
      if (ok) shown++;
    });
    if (count) count.textContent = "Showing " + shown + " of " + SKILLS.length + " skills";
    Array.prototype.forEach.call(bar.children, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === active));
    });
  }

  ["All"].concat(cats).forEach(function (c) {
    var n = c === "All" ? SKILLS.length : SKILLS.filter(function (s) { return s.category === c; }).length;
    var b = el("button", "fbtn");
    b.type = "button";
    b.setAttribute("data-cat", c);
    b.appendChild(document.createTextNode(c));
    b.appendChild(el("span", "n", String(n)));
    b.addEventListener("click", function () { active = c; apply(); });
    bar.appendChild(b);
  });
  apply();
})();