import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const FindMentor = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnpassword, setcnPassword] = useState("");

  const handleRegisterBtn = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  const handleOutsideClick = (e) => {
    navigate("/");
  };
  return (
    <>
      <div
        onClick={handleOutsideClick}
        className="w-full backdrop-blur-sm top-0 absolute h-[120vh] z-10"
      ></div>
      <div className="z-20 relative h-[70vh] flex justify-center ">
        <div className="w-3/4 bg-blue-400 h-full p-6 leading-loose rounded-2xl shadow-2xl"></div>
      </div>
    </>
  );
};

export default FindMentor;
