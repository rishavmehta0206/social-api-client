import { useState } from "react";
import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import { useAuthContext } from "../../context/AuthContext/AuthProvider";
import axios from "axios";
import { usePostContext } from "../../context/PostContext/PostProvider";

export default function Share() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const { user:loggedInUser } = useAuthContext();
  const {dispatch} = usePostContext()

  // const submitHandler = async (e) => {
  //   let uploadedImage = null;
  //   e.preventDefault();
  //   const apiBody = {
  //     userId: user._id,
  //     desc: description,
  //   };
  //   if(file){
  //     const data = new FormData();
  //     const fileName = file.name;
  //     data.append("file",file);
  //     data.append("name",fileName)
  //     apiBody.img = fileName;
  //     try {
  //      uploadedImage = await axios.post("http://localhost:8800/api/upload",data)
  //      console.log(uploadedImage)
  //      apiBody.img = uploadedImage.url;
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   try {
  //     let {data} = await axios.post("http://localhost:8800/api/post", apiBody);
  //     dispatch({type:"ADD_POST",payload:data})
  //   } catch (error) {}
  // };

  let userImage =
  loggedInUser?.profilePicture?.length > 0
    ? loggedInUser?.profilePicture
    : "assets/person/user.png";

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'imageuploadsocial'); // Replace with your Cloudinary upload preset

        const response = await axios.post('https://api.cloudinary.com/v1_1/dytiefj4e/image/upload', formData);
        uploadedImageUrl = response.data.secure_url; // Get the secure URL of the uploaded image from Cloudinary
      }

      const apiBody = {
        userId: loggedInUser._id,
        desc: description,
        img: uploadedImageUrl // Attach the Cloudinary image URL to the API body
      };

      const { data } = await axios.post('https://social-api-server.vercel.app/api/post', apiBody);
      dispatch({ type: 'ADD_POST', payload: data });

      // Clear form fields after successful submission
      setDescription('');
      setFile(null);

    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  console.log('file',file?.name)
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" style={{
            objectFit:'cover'
          }} src={userImage} alt="" />
          <input
            placeholder="What's in your mind"
            className="shareInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <hr className="shareHr" />
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            {/* <label htmlFor="file" className="shareOption"> */}
               <div className="shareOption">
               <label htmlFor="flieUp">
                     <img
                       style={{
                         cursor: "pointer",
                         height: "25px",
                         width: "25px",
                       }}
                       // className="profileUserImg"
                       src="/assets/person/bgImage.png"
                       alt=""
                     />
                   </label>
              <span className="shareOptionText">Photo</span>
              <input
                style={{
                  display: "none",
                }}
                type="file"
                id="flieUp"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
               </div>
            {/* </label> */}
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
