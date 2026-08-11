export default function SearchBar({ search, setSearch }) {

  return (

    <div className="search-container">

      <input

        type="text"

        placeholder="Buscar artista..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

      />

    </div>

  );

}