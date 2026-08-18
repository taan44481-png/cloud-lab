import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/students/${editingId}`
        : "/api/students";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Có lỗi xảy ra");
        return;
      }

      if (editingId) {
        setStudents(
          students.map((student) =>
            student._id === editingId ? data : student
          )
        );
        alert("Cập nhật sinh viên thành công!");
      } else {
        setStudents([...students, data]);
        alert("Thêm sinh viên thành công!");
      }

      setStudentId("");
      setName("");
      setEmail("");
      setEditingId(null);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối Backend");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  const handleCancel = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };
  const handleDelete = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
    return;
  }

  try {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Xóa thất bại");
      return;
    }

    setStudents(students.filter((student) => student._id !== id));

    alert("Xóa sinh viên thành công!");
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể kết nối Backend");
  }
};

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
          />
        </div>

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <button type="submit">
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              {student.studentId} - {student.name} - {student.email}{" "}
              <button onClick={() => handleEdit(student)}>
                Sửa
              </button>
              <button onClick={() => handleDelete(student._id)}>
      Xóa
    </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;