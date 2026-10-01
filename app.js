
const container = document.getElementById("sellingPointsContainer");
const searchInput = document.getElementById("searchInput");

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function renderSellingPoints() {
  const searchTerm = normalize(searchInput.value);

  const filtered = sellingPoints.filter(point => {
    const searchableText = [
      point.name,
      point.governorate,
      point.area,
      point.type,
      point.phone
    ]
      .map(normalize)
      .join(" ");

    return searchableText.includes(searchTerm);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="message-box">
        لا توجد نقاط بيع مطابقة للبحث.
      </div>
    `;
    return;
  }

  const grouped = {};

  filtered.forEach(point => {
    const governorate = point.governorate || "غير محدد";
    const area = point.area || "غير محدد";

    if (!grouped[governorate]) {
      grouped[governorate] = {};
    }

    if (!grouped[governorate][area]) {
      grouped[governorate][area] = [];
    }

    grouped[governorate][area].push(point);
  });

  container.innerHTML = "";

  Object.keys(grouped).forEach(governorate => {
    const governorateSection = document.createElement("section");
    governorateSection.className = "governorate";

    const governorateTitle = document.createElement("h2");
    governorateTitle.className = "governorate-title";
    governorateTitle.textContent = governorate;

    governorateSection.appendChild(governorateTitle);

    Object.keys(grouped[governorate]).forEach(area => {
      const areaSection = document.createElement("div");
      areaSection.className = "area";

      const areaTitle = document.createElement("h3");
      areaTitle.className = "area-title";
      areaTitle.textContent = area;

      areaSection.appendChild(areaTitle);

      grouped[governorate][area].forEach(point => {
        areaSection.appendChild(createSellingPointCard(point));
      });

      governorateSection.appendChild(areaSection);
    });

    container.appendChild(governorateSection);
  });
}

function createSellingPointCard(point) {
  const card = document.createElement("article");
  card.className = "selling-card";

  const name = document.createElement("h3");
  name.textContent = point.name || "";

  card.appendChild(name);

  if (point.type) {
    const type = document.createElement("div");
    type.className = "type-badge";
    type.textContent = point.type;

    card.appendChild(type);
  }

  if (point.phone) {
    const phone = document.createElement("div");
    phone.className = "card-info";
    phone.textContent = `☎ ${point.phone}`;

    card.appendChild(phone);
  }

  const actions = document.createElement("div");
  actions.className = "actions";

  if (point.map) {
    const mapButton = document.createElement("a");

    mapButton.className = "btn btn-map";
    mapButton.href = point.map;
    mapButton.target = "_blank";
    mapButton.rel = "noopener noreferrer";
    mapButton.textContent = "الموقع 📍";

    actions.appendChild(mapButton);
  }

  if (point.phone) {
    const callButton = document.createElement("a");

    callButton.className = "btn btn-call";
    callButton.href = `tel:${String(point.phone).replace(/[^\d+]/g, "")}`;
    callButton.textContent = "اتصال ☎";

    actions.appendChild(callButton);
  }

  if (actions.children.length > 0) {
    card.appendChild(actions);
  }

  return card;
}

searchInput.addEventListener("input", renderSellingPoints);

renderSellingPoints();
