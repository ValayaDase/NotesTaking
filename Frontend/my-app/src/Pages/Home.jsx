import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import AddNoteModal from "./AddNote";
import axios from "axios";
import { toast } from "react-toastify";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState("");
  const [editNote , setEditNote] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Get userId from localStorage once
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notes/fetchnotes/${userId}`
      );
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  // Add new note
const handleSaveNote = async (note) => {
  try {
    if(editNote){
      await axios.put(`http://localhost:5000/api/notes/updatenote/${userId}/${editNote._id}`,
        note
      );
      toast.success("notes updated successfuly");
      setEditNote(null);
    }
    else{
      await axios.post("http://localhost:5000/api/notes/addnote", {
      ...note,
      userId: userId,   //  must match backend schema
    });
    toast.success("Note added successfully");
    }


    
    setIsModalOpen(false);
    fetchNotes(); // Refresh notes after adding
  } catch (error) {
    const message = error.response?.data?.message || "Failed to save note";
    toast.error(message);
  }
};



// delete function

const handleDelete=async(noteId)=>{
  try{
    const response = await axios.delete(`http://localhost:5000/api/notes/deletenote/${userId}/${noteId}`);
    toast.success(response.data);
    fetchNotes(); // referesh all notes again
  }
  catch(error){
    const message = error.response?.data?.message || "Failed to delete note";
    toast.error(message);
  }
}


// edit function

const handleEdit = async (note) => {
  setEditNote(note);
  setIsModalOpen(true);
}


const sortedNotes = [...notes]
  .filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) || note.categories?.some(cat => cat.toLowerCase().includes(search.toLowerCase()))
  )
  .sort((a,b)=>{
    if(!sortBy) return 0;
    if(sortBy==="newest") return 0;   // already default newest mei display kar rahe hai , fetch karte time sort kar rahe hai
    if(sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);  // database mei purana upar hai naya wala neeche add hota jata hai so agar a mei first purana gaya and b mei naya gaya tho a-b negative aayega so swap hoga purana wala aage aayega
    if(sortBy === "az") return a.title.localeCompare(b.title); // localCompare 2 string ko alphabetically compare karta hai
    if(sortBy === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar search={search} setSearch={setSearch} />  {/*navbar mei props bhej rahe hai jidhar seach hone pe setSearch hoga and vapas home pe he aayega */}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-gray-700"
            >
              Sort
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              // defaultValue="newest"      value and defaultValue dono ek sath ny use karte hain
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
          </div>
        </div>

        <section className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {
              // .filter((note) => note.title.toLowerCase().includes(search.toLowerCase()))
              // .filter(note=>{
              //   searchLower = search.toLowerCase();
              //   titleMatch = note.title.toLowerCase().includes(searchLower)
              //   catMatch = note.categories?.some(cat=>cat.toLowerCase().includes(searchLower));    // cat ek arrow function hai jo har ek notes ke category ke liye check karega .some() ek JavaScript array method hai jo check karta hai ki array ka koi bhi element condition ko satisfy karta hai ya nahi.
              //   return titleMatch || catMatch;   // jo search se related notes hoga return karega vo notes fir map vo display karega agar kuch notes match ny hua search se tho sab notes display honge
              // })
              sortedNotes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 bg-white rounded-lg shadow relative"
                >
                  {/* Title + Icons */}
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800">{note.title}</h3>
                  <div className="flex gap-2">

                    {/* Edit Icon */}
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          d="M4 16h12a2 2 0 012 2v0a2 2 0 01-2 2H4a2 2 0 01-2-2v0a2 2 0 012-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 8a1 1 0 011-1h6a1 1 0 011 1v9a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm9-3h-3.5l-1-1h-3l-1 1H4v2h12V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mt-2">{note.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {note.categories?.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Add Note Button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-black text-white shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14M5 12h14"
          />
        </svg>
      </button>

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() =>{
          setIsModalOpen(false);
          setEditNote(null);
        }}
        onSave={handleSaveNote}
        editNote={editNote}
      />
    </div>
  );
}

export default Home;
