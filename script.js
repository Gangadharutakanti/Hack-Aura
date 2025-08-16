
   const collegeData = {
    mba: {
      title: "🏆 Top MBA Colleges",
      colleges: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "XLRI Jamshedpur", "SPJIMR Mumbai"]
    },
    engineering: {
      title: "🏆 Top Engineering Colleges",
      colleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani", "NIT Trichy"]
    },
    medical: {
      title: "🏆 Top Medical Colleges",
      colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER Puducherry", "KMC Manipal", "AFMC Pune"]
    }
  };

  const searchColleges = {
    "SRM AP": {
      name: "SRM University AP",
      location: "Amaravati, Andhra Pradesh",
      ranking: 50,
      tuitionFee: 3.8,
      placementRate: 100,
      entranceExam: "SRMJEEE",
      scholarships: "50% Merit Scholarship + Category-based aid",
      logo: "srmap.png"
    },
    "VIT AP": {
      name: "VIT-AP University",
      location: "Amaravati, Andhra Pradesh",
      ranking: 20,
      tuitionFee: 1.95,
      placementRate: 95,
      entranceExam: "VITEEE",
      scholarships: "Merit-based up to 75% fee waiver",
      logo: "vitap.png"
    },
    "IIT Bombay": {
      name: "Indian Institute of Technology Bombay",
      location: "Mumbai, Maharashtra",
      ranking: 3,
      tuitionFee: 2,
      placementRate: 100,
      entranceExam: "JEE Advanced",
      scholarships: "Government & Merit Scholarships (up to 100%)",
      logo: "Screenshot 2025-08-16 175412.png"
    },
    "IIIT Hyderabad": {
      name: "International Institute of Information Technology, Hyderabad",
      location: "Hyderabad, Telangana",
      ranking: 8,
      tuitionFee: 3,
      placementRate: 98,
      entranceExam: "JEE Advanced / UGEE / SPEC",
      scholarships: "Merit & Need-based Scholarships",
      logo: "ideivTQzQq_1755347090191.png"
    },
    "MIT Pune": {
      name: "MIT World Peace University, Pune",
      location: "Pune, Maharashtra",
      ranking: 45,
      tuitionFee: 2.2,
      placementRate: 85,
      entranceExam: "JEE Main / MHT-CET",
      scholarships: "Merit-based up to 50% waiver",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/6b/MIT_WPU_logo.png"
    }
  };

  let compareList = [];
  let currentCategory = "";
  let savedList = JSON.parse(localStorage.getItem("savedColleges")) || [];

  function showColleges(type) {
    const container = document.getElementById("categoryResult");
    if (currentCategory === type) {
      container.innerHTML = "";
      currentCategory = "";
      return;
    }
    const data = collegeData[type];
    container.innerHTML = `<h2>${data.title}</h2><ul>${data.colleges.map(c => `<li>${c}</li>`).join('')}</ul>`;
    currentCategory = type;
  }

  function searchCollege() {
    const query = document.getElementById("searchInput").value.trim();
    const college = searchColleges[query];
    if (!college) {
      document.getElementById("searchResult").innerHTML = "<p style='text-align:center;'>No college found.</p>";
      return;
    }
    const isSaved = savedList.includes(query);
    document.getElementById("searchResult").innerHTML = `
      <div class="college-card">
        <img src="${college.logo}" class="college-logo"><br>
        <h2>${college.name}</h2>
        <p>📍 ${college.location}</p>
        <p>🏆 NIRF Rank: ${college.ranking}</p>
        <p>💰 Tuition Fee (LPA): ${college.tuitionFee}</p>
        <p>🎯 Placement Rate (%): ${college.placementRate}</p>
        <p>📝 Entrance Exam: ${college.entranceExam}</p>
        <p>🎓 Scholarships: ${college.scholarships}</p>
        <button onclick="addToCompare('${query}')">➕ Add to Compare</button>
        <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave('${query}')">⭐ Save</button>
      </div>`;
    renderSaved();
  }

  function addToCompare(collegeKey) {
    if (!compareList.includes(collegeKey)) compareList.push(collegeKey);
    showComparison();
  }

  function removeFromCompare(collegeKey) {
    compareList = compareList.filter(c => c !== collegeKey);
    showComparison();
  }

  function showComparison() {
    if (!compareList.length) {
      document.getElementById("compareTable").innerHTML = "";
      return;
    }
    const bestRanking = Math.min(...compareList.map(k => searchColleges[k].ranking));
    const bestTuition = Math.min(...compareList.map(k => searchColleges[k].tuitionFee));
    const bestPlacement = Math.max(...compareList.map(k => searchColleges[k].placementRate));
    let rows = `
      <tr>
        <th>College</th>
        <th>Location</th>
        <th>Ranking</th>
        <th>Tuition Fee (LPA)</th>
        <th>Placement Rate (%)</th>
        <th>Entrance Exam</th>
        <th>Scholarships</th>
        <th>Action</th>
      </tr>`;
    compareList.forEach(k => {
      const c = searchColleges[k];
      rows += `
        <tr>
          <td><img src="${c.logo}" class="college-logo"><br>${c.name}</td>
          <td>${c.location}</td>
          <td class="${c.ranking === bestRanking ? 'best' : ''}">${c.ranking}</td>
          <td class="${c.tuitionFee === bestTuition ? 'best' : ''}">${c.tuitionFee}</td>
          <td class="${c.placementRate === bestPlacement ? 'best' : ''}">${c.placementRate}</td>
          <td>${c.entranceExam}</td>
          <td>${c.scholarships}</td>
          <td><span class="delete-btn" onclick="removeFromCompare('${k}')">❌ Remove</span></td>
        </tr>`;
    });
    document.getElementById("compareTable").innerHTML = `<h2 style="text-align:center;">📊 College Comparison</h2><table>${rows}</table>`;
  }

  function applyFilter() {
    const filter = document.getElementById("filter").value;
    if (!compareList.length) return;
    if (filter === "ranking") {
      compareList.sort((a, b) => searchColleges[a].ranking - searchColleges[b].ranking);
    } else if (filter === "fee") {
      compareList.sort((a, b) => searchColleges[a].tuitionFee - searchColleges[b].tuitionFee);
    } else if (filter === "placement") {
      compareList.sort((a, b) => searchColleges[b].placementRate - searchColleges[a].placementRate);
    }
    showComparison();
  }

  function toggleMode() {
    document.body.classList.toggle("light-mode");
  }

  function toggleSave(key) {
    if (savedList.includes(key)) {
      savedList = savedList.filter(k => k !== key);
    } else {
      savedList.push(key);
    }
    localStorage.setItem("savedColleges", JSON.stringify(savedList));
    searchCollege();
  }

  function renderSaved() {
    if (!savedList.length) {
      document.getElementById("savedColleges").innerHTML = "";
      return;
    }
    let html = "<h2 style='text-align:center;'>⭐ Saved Colleges</h2><ul>";
    savedList.forEach(key => {
      if (searchColleges[key]) {
        html += `<li>${searchColleges[key].name}</li>`;
      }
    });
    html += "</ul>";
    document.getElementById("savedColleges").innerHTML = html;
  }

  renderSaved();