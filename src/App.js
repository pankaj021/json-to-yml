import React, {useState} from 'react';
import { useForm } from 'react-hook-form'
import './App.css';

function App() {
  const { register, handleSubmit } = useForm()
  const [yml, setYml] = useState('');

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("jsonFile", data.jsonFile[0])

    const res = await fetch("http://localhost:4000/parse", {
      method: "POST",
      body: formData
    }).then(res => res.json())
    setYml(res.yml || "")
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input ref={register} type="file" name="jsonFile" />
        <button>Submit</button>
      </form>
      <h1>YML</h1>
      <textarea id="yml" name="yml" value={yml} onChange={() => {}}/>
    </div>
  );
}

export default App;
