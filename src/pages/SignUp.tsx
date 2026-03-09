import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {

const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [pais, setPais] = useState("");
const [provincia, setProvincia] = useState("");
const [localidad, setLocalidad] = useState("");

const [empresa, setEmpresa] = useState("");
const [crearEmpresa, setCrearEmpresa] = useState(false);

const [loading, setLoading] = useState(false);

const handleSignup = async (e: any) => {

e.preventDefault();

setLoading(true);

try {

const { data, error } = await supabase.auth.signUp({
email,
password
});

if (error) throw error;

const user = data.user;

if (!user) {
setLoading(false);
return;
}

const role = crearEmpresa ? "empresa" : "tech";

const { error: profileError } = await supabase
.from("profiles")
.upsert({
id: user.id,
email: user.email,
pais,
provincia,
localidad,
role
});

if (profileError) {
console.log("profile error", profileError);
}

if (crearEmpresa && empresa.trim() !== "") {

const { data: empresaData, error: empresaError } = await supabase
.from("empresas")
.insert({
nombre: empresa,
pais,
provincia,
localidad
})
.select()
.single();

if (empresaError) {
console.log("empresa error", empresaError);
}

if (empresaData) {

const { error: linkError } = await supabase
.from("tecnicos_empresa")
.insert({
empresa_id: empresaData.id,
user_id: user.id,
rol: "admin"
});

if (linkError) {
console.log("link error", linkError);
}

}

}

alert("Cuenta creada. Revisá tu email.");

navigate("/login");

} catch (err: any) {

console.log(err);
alert(err.message);

}

setLoading(false);

};

return (

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<form
onSubmit={handleSignup}
className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
>

<h2 className="text-xl font-bold text-center">
Crear cuenta
</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
className="w-full border p-2 rounded"
/>

<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
className="w-full border p-2 rounded"
/>

<input
type="text"
placeholder="País"
value={pais}
onChange={(e) => setPais(e.target.value)}
required
className="w-full border p-2 rounded"
/>

<input
type="text"
placeholder="Provincia"
value={provincia}
onChange={(e) => setProvincia(e.target.value)}
required
className="w-full border p-2 rounded"
/>

<input
type="text"
placeholder="Localidad"
value={localidad}
onChange={(e) => setLocalidad(e.target.value)}
required
className="w-full border p-2 rounded"
/>

<div className="flex items-center gap-2 text-sm">

<input
type="checkbox"
checked={crearEmpresa}
onChange={(e) => setCrearEmpresa(e.target.checked)}
/>

<span>
Crear empresa
</span>

</div>

{crearEmpresa && (

<input
type="text"
placeholder="Nombre de la empresa"
value={empresa}
onChange={(e) => setEmpresa(e.target.value)}
className="w-full border p-2 rounded"
/>

)}

<button
type="submit"
disabled={loading}
className="w-full bg-blue-900 text-white py-2 rounded"
>

{loading ? "Creando..." : "Crear cuenta"}

</button>

</form>

</div>

);

}