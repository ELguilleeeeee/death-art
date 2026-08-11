import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import GaleriaMes from "../components/GaleriaMes";

import "../styles/Home.css";

export default function Home() {

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {

    const usuario = localStorage.getItem("usuario");

    if (!usuario) {

      navigate("/");

      return;

    }

    obtenerObras();

  }, [navigate]);

  const obtenerObras = () => {

    fetch("https://death-art.onrender.com/obras")

      .then(res => res.json())

      .then(data => {

        setPosts(data);

      })

      .catch(err => console.log(err));

  };

  const filteredPosts = posts.filter(post => {

    const titulo = post.titulo || "";

    const artista = post.nombre || "";

    return (

      titulo.toLowerCase().includes(search.toLowerCase()) ||

      artista.toLowerCase().includes(search.toLowerCase())

    );

  });

  return (

    <div className="home-page">

      <Navbar
        openSidebar={() =>
          setSidebarOpen(true)
        }
      />

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={() =>
          setSidebarOpen(false)
        }
      />
      <GaleriaMes/>


      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <div className="artist-list">

        {

          filteredPosts.map(post => (

            <PostCard

              key={post.id}

              post={post}

            />

          ))

        }

      </div>

      <Footer />

    </div>

  );

}