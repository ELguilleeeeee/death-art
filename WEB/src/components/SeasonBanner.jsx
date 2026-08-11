import { useEffect, useState } from "react";
import "./../styles/SeasonBanner.css";

export default function SeasonBanner() {

  const [season, setSeason] = useState({});

  useEffect(() => {

    const month = new Date().getMonth() + 1;

    if (month === 1) {

      setSeason({
        title: "🎆 Feliz Año Nuevo",
        message: "Descubre los primeros eventos del año en Querétaro.",
        className: "newyear"
      });

    } else if (month === 2) {

      setSeason({
        title: "❤️ San Valentín",
        message: "Encuentra eventos para disfrutar en pareja o con amigos.",
        className: "valentine"
      });

    } else if (month >= 3 && month <= 5) {

      setSeason({
        title: "🌸 Primavera",
        message: "Disfruta los mejores festivales y actividades al aire libre.",
        className: "spring"
      });

    } else if (month >= 6 && month <= 8) {

      setSeason({
        title: "☀️ Verano",
        message: "Explora conciertos, ferias y eventos de temporada.",
        className: "summer"
      });

    } else if (month === 9) {

      setSeason({
        title: "🇲🇽 Mes Patrio",
        message: "Celebra las fiestas mexicanas con eventos locales.",
        className: "mexico"
      });

    } else if (month === 10) {

      setSeason({
        title: "🎃 Halloween",
        message: "Encuentra fiestas, recorridos y eventos de terror.",
        className: "halloween"
      });

    } else if (month === 11) {

      setSeason({
        title: "💀 Día de Muertos",
        message: "Descubre altares, desfiles y tradiciones de Querétaro.",
        className: "dead"
      });

    } else {

      setSeason({
        title: "🎄 Navidad",
        message: "Vive la magia de la Navidad con eventos para toda la familia.",
        className: "christmas"
      });

    }

  }, []);

  return (

    <div className={`season-banner ${season.className}`}>

      <h1>{season.title}</h1>

      <p>{season.message}</p>

    </div>

  );

}