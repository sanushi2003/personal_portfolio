/* =====================================================================
   PROJECTS PAGE DATA. This is the only part you need to edit.

   Add a project: copy one { ... } block, paste it after a comma, edit it.
   image: save a screenshot in a folder called  images  next to the html
          files and write its path. Leave "" to show an empty box.
   github / demo: leave "" to hide that link.
   ===================================================================== */

var PROJECTS = [
  {
    name: "FctCare E-Channeling System",
    description: "fctCare is a PHP and MySQL-based e-channeling platform that simplifies doctor appointments and helps patients find doctors and hospitals through a user-friendly system.",
    tech: ["HTML/CSS", "JavaScript", "PHP", "VS code", "phpMyAdmin", "XAMPP", "MySQL"],
    github: "https://github.com/sanushi2003/fctCare_eChannelling_System",
    demo: "http://localhost/fctCare_eChannelling_System/index.php",
    image: "images/projects/p5.png"
  },
  {
    name: "Project name two",
    description: "Placeholder: describe your role, what you built and what you learned from it.",
    tech: ["React", "Node.js"],
    github: "https://github.com/",
    demo: "https://example.com/",
    image: "images/project-2.jpg"
  },
  {
    name: "Project name three",
    description: "Placeholder: a university group project or assignment works well here.",
    tech: ["Java", "MySQL"],
    github: "https://github.com/",
    demo: "",
    image: "images/project-3.jpg"
  }
];

/* ============================== RENDERING ============================== */
(function () {
  var root = document.getElementById("projects");
  if (!root || !window.PF) return;
  var el = PF.el;

  PROJECTS.forEach(function (p) {
    var card = el("article", "card");
    var isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(p.image || "");
if (isVideo) {
  var box = el("div", "pimg pvideo");
  var v = document.createElement("video");
      v.src = p.image;
      v.controls = true;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.setAttribute("aria-label", p.name + " demo video");
      box.appendChild(v);
      card.appendChild(box);
    } else {
  card.appendChild(PF.photo(p.image, p.name + " screenshot", "pimg", p.name, "Project screenshot"));
}
    card.appendChild(el("h3", "", p.name));
    if (p.description) card.appendChild(el("p", "", p.description));
    if (p.tech && p.tech.length) {
      var ul = el("ul", "chips");
      p.tech.forEach(function (t) { ul.appendChild(el("li", "", t)); });
      card.appendChild(ul);
    }
    var links = el("div", "links");
    [["GitHub", p.github], ["Live demo", p.demo]].forEach(function (l) {
      if (!l[1]) return;
      var a = el("a", "", l[0]);
      a.href = l[1]; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    });
    if (links.children.length) card.appendChild(links);
    root.appendChild(card);
  });
})();
