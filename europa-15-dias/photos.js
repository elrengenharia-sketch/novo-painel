// Fotografias por cena. Fonte principal: Wikimedia Commons (redirect estável para thumbnail).
// Cada entrada corresponde, na ordem, às cenas de TRIP.chapters[].scenes[].
// Se uma imagem não carregar, o motor de cenas em Canvas assume o lugar dela.
(function () {
  const C = (file, w) =>
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/" + file + "?width=" + (w || 1800);

  const PHOTOS = {
    paris: [
      { src: C("Notre_Dame_dalla_Senna.jpg"), by: "Zairon", lic: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Notre_Dame_dalla_Senna.jpg" },
      { src: C("Louvre_Museum_Wikimedia_Commons.jpg"), by: "Benh LIEU SONG", lic: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Louvre_Museum_Wikimedia_Commons.jpg" },
      { src: C("Eiffel_tower_from_trocadero.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Eiffel_tower_from_trocadero.jpg" }
    ],
    brussels: [
      { src: C("Edificios_en_la_Grand-Place%2C_Bruselas%2C_B%C3%A9lgica%2C_2021-12-15%2C_DD_184-186_HDR.jpg"), by: "Diego Delso", lic: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Edificios_en_la_Grand-Place,_Bruselas,_B%C3%A9lgica,_2021-12-15,_DD_184-186_HDR.jpg" },
      { src: C("Galeries_Royales_Saint-Hubert%2C_Brussels%2C_Belgium_-_20071014.jpg"), by: "Rkieferbaum", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Galeries_Royales_Saint-Hubert,_Brussels,_Belgium_-_20071014.jpg" },
      { src: C("Brussels_view_from_Mont_des_Arts%2C_Brussels%2C_Belgium_%28cropped%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Brussels_view_from_Mont_des_Arts,_Brussels,_Belgium_(cropped).jpg" }
    ],
    amsterdam: [
      { src: C("Canal_in_Jordaan%2C_Amsterdam_%289258952020%29.jpg"), by: "kevinmcgill, Den Bosch", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Canal_in_Jordaan,_Amsterdam_(9258952020).jpg" },
      { src: C("Amstel_Robijn_tour_boat_%28ENI_02008161%29%2C_Amsterdam_Canal_Cruises%2C_Amsterdam-9148.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Amstel_Robijn_tour_boat_(ENI_02008161),_Amsterdam_Canal_Cruises,_Amsterdam-9148.jpg" },
      { src: C("Rijksmuseum_Amsterdam.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Rijksmuseum_Amsterdam.jpg" }
    ],
    cologne: [
      { src: C("Cologne_Cathedral_from_Deutz.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Cologne_Cathedral_from_Deutz.jpg" },
      { src: C("Cologne_-_Panoramic_Image_of_the_old_town_at_dusk.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Cologne_-_Panoramic_Image_of_the_old_town_at_dusk.jpg" },
      { src: C("Hohenzollernbr%C3%BCcke_K%C3%B6ln.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Hohenzollernbr%C3%BCcke_K%C3%B6ln.jpg" }
    ],
    luxembourg: [
      { src: C("Luxemburg-Grund-von-Corniche.JPG"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Luxemburg-Grund-von-Corniche.JPG" },
      { src: C("Bock_casemates%2C_Luxembourg_-_panoramio_%281%29.jpg"), by: "panoramio", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Bock_casemates,_Luxembourg_-_panoramio_(1).jpg" },
      { src: C("Luxembourg_BW_2016-09-15_12-44-12.jpg"), by: "Berthold Werner", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Luxembourg_BW_2016-09-15_12-44-12.jpg" }
    ],
    strasbourg: [
      { src: C("Strasbourg_Cathedral_-_France_-_2024-9.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Strasbourg_Cathedral_-_France_-_2024-9.jpg" },
      { src: C("Strasbourg-Ancien_entrep%C3%B4t_de_la_Petite_France_%288%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Strasbourg-Ancien_entrep%C3%B4t_de_la_Petite_France_(8).jpg" },
      { src: C("Tower_%40_Ponts_Couverts_%40_Roof_%40_Barrage_Vauban_%40_Strasbourg_%2845468590932%29.jpg"), by: "Guilhem Vellut, Annecy", lic: "CC BY", href: "https://commons.wikimedia.org/wiki/File:Tower_@_Ponts_Couverts_@_Roof_@_Barrage_Vauban_@_Strasbourg_(45468590932).jpg" }
    ],
    lucerne: [
      { src: C("Chapel_bridge_Lucerne_Switzerland_2014_-_panoramio.jpg"), by: "panoramio", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Chapel_bridge_Lucerne_Switzerland_2014_-_panoramio.jpg" },
      { src: C("Titlis_-_panoramio.jpg"), by: "panoramio", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Titlis_-_panoramio.jpg" },
      { src: C("Lucerne_lake_and_mountains.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Lucerne_lake_and_mountains.jpg" }
    ],
    italy: [
      { src: C("Milan_Cathedral_from_Piazza_del_Duomo.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Milan_Cathedral_from_Piazza_del_Duomo.jpg" },
      { src: C("Galleria_Vittorio_Emanuele_II_%28Milan%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Galleria_Vittorio_Emanuele_II_(Milan).jpg" },
      { src: C("Canal_Grande_Chiesa_della_Salute_e_Dogana_dal_Ponte_dell%27_Accademia.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Canal_Grande_Chiesa_della_Salute_e_Dogana_dal_Ponte_dell%27_Accademia.jpg" }
    ],
    vienna: [
      { src: C("Cathedral_Saint_Stephen_at_night_%288442221086%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Cathedral_Saint_Stephen_at_night_(8442221086).jpg" },
      { src: C("Schloss_Sch%C3%B6nbrunn_Wien_2014_%28Zuschnitt%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Schloss_Sch%C3%B6nbrunn_Wien_2014_(Zuschnitt).jpg" },
      { src: C("Upper_Belvedere_palace_Vienna.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Upper_Belvedere_palace_Vienna.jpg" }
    ],
    budapest: [
      { src: C("Buda_Castle_and_Danube_River%2C_Budapest%2C_1988.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Buda_Castle_and_Danube_River,_Budapest,_1988.jpg" },
      { src: C("Hungarian_Parliament_Building_from_across_the_Danube_at_night_further.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Hungarian_Parliament_Building_from_across_the_Danube_at_night_further.jpg" },
      { src: C("Sz%C3%A9chenyi_Thermal_Bath_Budapest.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Sz%C3%A9chenyi_Thermal_Bath_Budapest.jpg" }
    ],
    bratislava: [
      { src: C("Bratislava-Old_Town%2C_Slovakia_-_panoramio_%28161%29.jpg"), by: "panoramio", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Bratislava-Old_Town,_Slovakia_-_panoramio_(161).jpg" },
      { src: C("Bratislava_Castle_from_the_Danube.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Bratislava_Castle_from_the_Danube.jpg" },
      { src: C("Danube_in_Bratislava%2C_Panorama%2C_Winter_2009.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Danube_in_Bratislava,_Panorama,_Winter_2009.jpg" }
    ],
    krakow: [
      { src: C("Sukiennice_and_Main_Market_Square_Krakow_Poland.JPG"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Sukiennice_and_Main_Market_Square_Krakow_Poland.JPG" },
      { src: C("Wawel_Castle_Krakow_Poland.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Wawel_Castle_Krakow_Poland.jpg" },
      { src: C("Saint_Kinga_%283869601170%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Saint_Kinga_(3869601170).jpg" }
    ],
    prague: [
      { src: C("Charles_Bridge%2C_Prague_%285665232622%29.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Charles_Bridge,_Prague_(5665232622).jpg" },
      { src: C("Prazsky_hrad_karluv_most_panorama.jpg"), by: "Wikimedia Commons", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Prazsky_hrad_karluv_most_panorama.jpg" },
      { src: C("Prague_Old_Town%27s_Astronomical_Clock_by_Libor_Skrlik.jpg"), by: "Libor Škrlík", lic: "CC BY-SA", href: "https://commons.wikimedia.org/wiki/File:Prague_Old_Town%27s_Astronomical_Clock_by_Libor_Skrlik.jpg" }
    ]
  };

  window.TRIP.chapters.forEach((ch) => {
    const list = PHOTOS[ch.id] || [];
    ch.scenes.forEach((sc, i) => {
      const p = list[i];
      if (p) { sc.photo = p.src; sc.credit = p; }
    });
  });
})();
