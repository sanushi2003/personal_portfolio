/* =====================================================================
   CERTIFICATES PAGE DATA. This is the only part you need to edit.

   Add a certificate: copy one { ... } block, paste it after a comma, edit it.
   image: save the certificate picture in a folder called  images  next to
          the html files and write its path. Leave "" to show an empty box.
   link:  credential link. Leave "" to hide it.
   ===================================================================== */

var CERTIFICATES = [
  
  { name: "Python for Beginners",   issuer: "University of Moratuwa | Credential ID : YgoYAsUAJe |", date: "02 Apr 2026", link: "https://open.uom.lk/lms/mod/customcert/verify_certificate.php", image: "images/certificate/python.png" },
  //{ name: "Introduction to Cybersecurity", issuer: "Cisco Networking Academ | Network Vulnerabilities | Cyber Best Practices | Privacy Data Confidentiality | Cybersecurity | Threat Detection", date: "14 Sep 2026", image: "images/certificate/cybersecurity.png" },
  //{ name: "Introduction to Artificial Intelligence ", issuer: "Simplilearn SkillUp Course | Certificate code : 10731916 |", date: "14 Sep 2026", image: "images/certificate/Artificial Intelligence.png" },
  { name: "Linux Essentials Certification ", issuer: "Cisco Networking Academy", date: "09 May 2026", image: "images/certificate/linux.png" },
];


/* ============================== RENDERING ============================== */
(function () {
  var root = document.getElementById("certificates");
  if (!root || !window.PF) return;
  var el = PF.el;

  CERTIFICATES.forEach(function (c) {
    var card = el("article", "card");
    card.appendChild(PF.photo(c.image, c.name + " certificate", "cimg", c.name + " · " + c.issuer, "Certificate image"));
    card.appendChild(el("h3", "", c.name));
    card.appendChild(el("div", "meta", [c.issuer, c.date].filter(Boolean).join(" · ")));
    if (c.link) {
      var links = el("div", "links");
      var a = el("a", "", "View credential");
      a.href = c.link; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
      card.appendChild(links);
    }
    root.appendChild(card);
  });
})();
