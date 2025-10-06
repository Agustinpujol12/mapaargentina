document.addEventListener("DOMContentLoaded", async function () {
  const provinces = document.querySelectorAll("path");
  const provinceInfo = document.getElementById("province-info");

  // Cargar datos desde el archivo JSON
  const response = await fetch("datos.json");
  const provincesData = await response.json();

  // EVENTO QUE MANEJA CLICKS EN LAS PROVINCIAS
  provinces.forEach((province) => {
    province.addEventListener("click", async () => {
      provinces.forEach((p) => p.classList.remove("active"));
      province.classList.add("active");

      const provinceName = province.getAttribute("id");
      const selectedProvince = getProvinceData(provinceName);

      const tourismSection = document.getElementById("tourismSection");
      const tourismEntriesContainer = document.getElementById("tourismEntries");

      tourismSection.style.display = "block";

      const tourismData = selectedProvince.tourism;

      if (tourismData && tourismData.length > 0) {
        showTourismEntries(tourismData);
      } else {
        tourismEntriesContainer.innerHTML = "<p>No hay información de turismo disponible.</p>";
      }

      function showTourismEntries(tourismData) {
        const tourismEntriesContainer = document.getElementById("tourismEntries");
        tourismEntriesContainer.innerHTML = "";

        tourismData.forEach((entry) => {
          const entryHTML = `
            <div class="tourism-entry">
              <div class="tourism-image">
                <img src="${entry.image}" alt="${entry.name}">
              </div>
              <div class="tourism-description">
                <h4>${entry.name}</h4>
                <p>${entry.description}</p>
              </div>
            </div>
          `;
          tourismEntriesContainer.innerHTML += entryHTML;
        });
      }

      if (selectedProvince) {
        const flickrApiKey = "a26984b694e49602b82d26167508bd46";
        const searchQuery = `${selectedProvince.name} argentina paisaje`;
        const flickrApiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&text=${searchQuery}&format=json&nojsoncallback=1`;

        try {
          const response = await fetch(flickrApiUrl);
          const data = await response.json();

          if (data.photos && data.photos.photo.length > 0) {
            const photo = data.photos.photo[0];
            const imageUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;

            const imageElement = `<img src="${imageUrl}" alt="${selectedProvince.name}">`;

            const provinceBoxHTML = `
              <div class="province-box">
                <h2>${selectedProvince.name}</h2>
                ${imageElement}
                <p><strong>Capital:</strong> ${selectedProvince.capital}</p>
                <p><strong>Población:</strong> ${selectedProvince.population}</p>
                <p><strong>Área:</strong> ${selectedProvince.area}</p>
                <p><strong>Descripción:</strong> ${selectedProvince.description}</p>
              </div>
            `;

            provinceInfo.innerHTML = provinceBoxHTML;
          } else {
            provinceInfo.innerHTML = `<h2>${selectedProvince.name}</h2><p>No se encontraron imágenes.</p>`;
          }
        } catch (error) {
          console.error("Error al obtener imágenes de Flickr:", error);
          provinceInfo.innerHTML = `<h2>${selectedProvince.name}</h2><p>Error al cargar imágenes.</p>`;
        }

        Swal.fire({
          icon: "success",
          title: `Has seleccionado la provincia de ${selectedProvince.name}`,
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
        });

        climaContainer.classList.remove("d-none");
      } else {
        provinceInfo.textContent = "No hay información disponible.";
      }
    });
  });

  function getProvinceData(provinceId) {
    const province = provincesData.find((p) => p.name === provinceId);
    return province || null;
  }
});











const tableBody = document.querySelector('#provincesTable tbody');
const sortPopulationLink = document.querySelector('#sortPopulation');
const sortAreaLink = document.querySelector('#sortArea');

let provincesData;
let sortByPopulationAsc = true;
let sortByAreaAsc = true;

// Cargar datos del JSON
fetch('datos.json')
    .then(response => response.json())
    .then(data => {
        provincesData = data;
        displayProvinces(provincesData);
    })
    .catch(error => console.error('Error al cargar datos:', error));

function displayProvinces(data) {
    tableBody.innerHTML = '';
    data.forEach(province => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${province.name}</td>
            <td>${province.population}</td>
            <td>${province.area}</td>
        `;
        tableBody.appendChild(row);
    });
}

function sortTableByColumn(column, ascending) {
    provincesData.sort((a, b) => {
        const valueA = a[column].replace(/,/g, '').replace(' km²', '');
        const valueB = b[column].replace(/,/g, '').replace(' km²', '');
        return ascending ? valueA - valueB : valueB - valueA;
    });
    displayProvinces(provincesData);
}

sortPopulationLink.addEventListener('click', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    sortByPopulationAsc = !sortByPopulationAsc;
    sortTableByColumn('population', sortByPopulationAsc);
});

sortAreaLink.addEventListener('click', function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    sortByAreaAsc = !sortByAreaAsc;
    sortTableByColumn('area', sortByAreaAsc);
});