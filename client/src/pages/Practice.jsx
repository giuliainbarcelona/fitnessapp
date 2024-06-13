const [selectedFile, setSelectedFile] = useState(null);
const [image, setImage] = useState([]);

useEffect(() => {
  getImage();
}, []);

async function getImage() {
  try {
    const res = await axios.get("/api/auth/register");
    setImages(res.data);
  } catch (err) {
    console.log(err);
  }
}

// On file select (from the pop up)
const onFileChange = (event) => {
  // Update the state
  console.log(event);
  setSelectedFile(event.target.files[0]);
};







// On file upload (click the upload button)
const onFileUpload = async () => {
  // Create an object of formData
  const formData = new FormData();

  // Update the formData object
  formData.append("imagefile", selectedFile, selectedFile.name);

  try {
    // Request made to the backend api
    // Send formData object
    const res = await axios.post("/api/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);
    getImage();
  } catch (err) {
    console.log(err);
  }
};