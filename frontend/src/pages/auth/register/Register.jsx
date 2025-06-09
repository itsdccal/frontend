// src/pages/register/Register.jsx

import { Link } from "react-router-dom";

export default function Register({ form, onChange, onSubmit }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Daftar Akun
        </h2>

        <input
          name="name"
          type="text"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Nomor Telepon"
          value={form.phone}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          name="address"
          type="text"
          placeholder="Alamat"
          value={form.address}
          onChange={onChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition cursor-pointer"
        >
          Selanjutnya
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}

