import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/students";

function App() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingId, setEditingId] = useState(null);

    // Lấy danh sách sinh viên
    useEffect(() => {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách sinh viên");
                }
                return response.json();
            })
            .then((data) => {
                setStudents(data);
            })
            .catch((error) => {
                console.error("Lỗi:", error);
            });
    }, []);

    // Thêm hoặc cập nhật sinh viên
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId || !name || !email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
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
                // Cập nhật sinh viên trong danh sách
                setStudents(
                    students.map((student) =>
                        student._id === editingId ? data : student
                    )
                );

                alert("Cập nhật sinh viên thành công!");
            } else {
                // Thêm sinh viên mới vào danh sách
                setStudents([...students, data]);

                alert("Thêm sinh viên thành công!");
            }

            // Xóa dữ liệu trong form
            setStudentId("");
            setName("");
            setEmail("");
            setEditingId(null);
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối Backend");
        }
    };

    // Chọn sinh viên để sửa
    const handleEdit = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);
    };

    // Hủy sửa
    const handleCancel = () => {
        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");
    };

    // Xóa sinh viên
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Xóa thất bại");
                return;
            }

            // Xóa sinh viên khỏi danh sách
            setStudents(
                students.filter((student) => student._id !== id)
            );

            alert("Xóa sinh viên thành công!");
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối Backend");
        }
    };

    return (
        <div>
            <h1>QUẢN LÝ SINH VIÊN - DOCKER HUB VERSION 2.0</h1>

            <h2>
                {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
            </h2>

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

                <br />

                <div>
                    <label>Họ tên: </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập họ tên"
                    />
                </div>

                <br />

                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email"
                    />
                </div>

                <br />

                <button type="submit">
                    {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
                </button>

                {editingId && (
                    <button type="button" onClick={handleCancel}>
                        Hủy
                    </button>
                )}
            </form>

            <hr />

            <h2>Danh sách sinh viên</h2>

            {students.length === 0 ? (
                <p>Chưa có sinh viên</p>
            ) : (
                <ul>
                    {students.map((student) => (
                        <li key={student._id}>
                            <strong>{student.studentId}</strong>
                            {" - "}
                            {student.name}
                            {" - "}
                            {student.email}
                            {" "}

                            <button onClick={() => handleEdit(student)}>
                                Sửa
                            </button>

                            {" "}

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
