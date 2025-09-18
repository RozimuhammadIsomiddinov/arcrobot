import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
} from "@adminjs/design-system";
import { useNavigate } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const navigate = useNavigate();

  const fetchBlogs = async (pageNumber = 1) => {
    const pageSize = 10;
    setLoading(true);
    try {
      const res = await axios.get("/api/blog", {
        params: { page: pageNumber, pageSize },
      });

      setBlogs(res.data.data || []);
      setPage(res.data.pagination.current_page || 1);
      setTotalPages(res.data.pagination.total_pages || 1);
      setNextPage(res.data.pagination.next_page);
      setPrevPage(res.data.pagination.prev_page);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDetailsClick = async (id) => {
    try {
      const res = await axios.get(`/api/blog/${id}`);
      setSelectedBlog(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching blog details:", err);
    }
  };

  const handleEditClick = (id) => {
    navigate(`/admin/resources/blog/records/${id}/edit`);
  };

  const leftCellStyle = {
    fontWeight: "bold",
    borderRight: "2px solid #ccc",
    width: "180px",
  };

  if (loading) {
    return <Box padding="xl">Загрузка...</Box>;
  }

  // 🔽 Saralangan bloglar
  const sortedBlogs = [...blogs].sort((a, b) => {
    const valA = a.order_key ?? 0;
    const valB = b.order_key ?? 0;
    return sortAsc ? valA - valB : valB - valA;
  });

  return (
    <Box variant="grey" padding="xl">
      <h2 style={{ marginBottom: 20 }}>Блоги</h2>

      {/* Saralash tugmalari */}
      <Box marginBottom="lg" display="flex" justifyContent="flex-end" gap="md">
        <Button
          size="sm"
          variant={sortAsc ? "primary" : "outlined"}
          onClick={() => setSortAsc(true)}
        >
          ↑ По порядку (возрастание)
        </Button>
        <Button
          size="sm"
          variant={!sortAsc ? "primary" : "outlined"}
          onClick={() => setSortAsc(false)}
        >
          ↓ По порядку (убывание)
        </Button>
      </Box>

      {/* Jadval */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={leftCellStyle}>ID</TableCell>
            <TableCell style={leftCellStyle}>Заголовок</TableCell>
            <TableCell style={leftCellStyle}>Порядок</TableCell>
            <TableCell style={leftCellStyle}>Телефон Автора</TableCell>
            <TableCell style={leftCellStyle}>Изображения</TableCell>
            <TableCell style={leftCellStyle}>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedBlogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} style={{ textAlign: "center" }}>
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            sortedBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell style={leftCellStyle}>{blog.id}</TableCell>
                <TableCell style={leftCellStyle}>{blog.title}</TableCell>
                <TableCell style={leftCellStyle}>
                  {blog.order_key ?? "—"}
                </TableCell>
                <TableCell style={leftCellStyle}>{blog.author_phone}</TableCell>
                <TableCell style={leftCellStyle}>
                  {Array.isArray(blog.images) ? (
                    blog.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`blog-img-${idx}`}
                        style={{ height: 40, marginRight: 5, borderRadius: 4 }}
                      />
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
                <TableCell style={leftCellStyle}>
                  {new Date(blog.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={() => handleDetailsClick(blog.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Подробнее
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEditClick(blog.id)}
                  >
                    Редактировать
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <Button
        size="sm"
        variant="outlined"
        disabled={!prevPage}
        onClick={() => fetchBlogs(prevPage)}
      >
        ← Предыдущая
      </Button>
      <Button
        size="sm"
        variant="outlined"
        disabled={!nextPage}
        onClick={() => fetchBlogs(nextPage)}
      >
        Следующая →
      </Button>

      {/* Modal */}
      {modalOpen && selectedBlog && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} width={700}>
          <Box padding="xl" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <h1 style={{ marginBottom: 20 }}>
              📄 Детали блога #{selectedBlog.id}
            </h1>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={leftCellStyle}>Заголовок</TableCell>
                  <TableCell>{selectedBlog.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Порядок</TableCell>
                  <TableCell>{selectedBlog.order_key ?? "—"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Подзаголовок</TableCell>
                  <TableCell>{selectedBlog.subtitles}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Изображения</TableCell>
                  <TableCell>
                    {Array.isArray(selectedBlog.images) ? (
                      selectedBlog.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`blog-img-${idx}`}
                          style={{
                            maxWidth: 120,
                            marginRight: 10,
                            marginBottom: 10,
                            borderRadius: 6,
                          }}
                        />
                      ))
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Описание</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedBlog.description,
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Автор</TableCell>
                  <TableCell>{selectedBlog.author_name || "—"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Фото автора</TableCell>
                  <TableCell>
                    {selectedBlog.author_image ? (
                      <img
                        src={selectedBlog.author_image}
                        alt="author"
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Телефон Автора</TableCell>
                  <TableCell>
                    {selectedBlog.author_phone ? (
                      <a
                        href={`tel:${selectedBlog.author_phone}`}
                        style={{
                          color: "#007bff",
                          textDecoration: "none",
                          fontSize: "15px",
                        }}
                      >
                        {selectedBlog.author_phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>О авторе</TableCell>
                  <TableCell>
                    {selectedBlog.author_description || "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={leftCellStyle}>Дата создания</TableCell>
                  <TableCell>
                    {new Date(selectedBlog.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box display="flex" justifyContent="flex-end" marginTop="lg">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Закрыть
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default BlogList;
