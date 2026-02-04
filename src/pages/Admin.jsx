import { useState } from 'react';
import { useData } from '../context/DataContext';
import Button from '../components/Button';
import { FaTrash, FaEdit, FaPlus, FaLock, FaUser, FaBriefcase } from 'react-icons/fa';

const Admin = () => {
    const {
        projects, addProject, updateProject, deleteProject,
        applicants, addApplicant, deleteApplicant,
        getIconComponent
    } = useData();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [activeTab, setActiveTab] = useState('projects'); // projects, applicants

    // Form States
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null); // null for new, object for edit
    const [uploadedLogo, setUploadedLogo] = useState(null);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500000) { // 500KB limit
                alert("File is too large. Max size is 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openProjectModal = (project = null) => {
        setCurrentProject(project);
        setUploadedLogo(project?.logoUrl || null);
        setIsProjectModalOpen(true);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginData.email === 'hiredplug@gmail.com' && loginData.password === 'password') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleProjectSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = {
            company: formData.get('company'),
            role: formData.get('role'),
            category: formData.get('category'),
            location: formData.get('location'),
            type: formData.get('type'),
            salary: formData.get('salary'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()),
            tags: formData.get('tags').split(',').map(tag => tag.trim()),
            description: formData.get('description'),
            logoIcon: formData.get('logoIcon') || 'FaGlobe',
            logoUrl: uploadedLogo || formData.get('logoUrl'),
            website: formData.get('website'),
            contactEmail: formData.get('contactEmail'),
            notificationEmail: formData.get('notificationEmail'),
            posted: 'Just now',
            status: 'Open'
        };

        if (currentProject) {
            updateProject(currentProject.id, projectData);
        } else {
            addProject(projectData);
        }
        setIsProjectModalOpen(false);
        setCurrentProject(null);
        setUploadedLogo(null);
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Delete this project?')) {
            deleteProject(id);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-page">
                <div className="login-card">
                    <h2><FaLock /> Admin Console</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </div>
                        <Button variant="primary" style={{ width: '100%' }} type="submit">Login</Button>
                    </form>
                </div>
                <style>{`
                    .admin-login-page {
                        height: 80vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #000;
                    }
                    .login-card {
                        background: #111;
                        padding: 3rem;
                        border-radius: 8px;
                        border: 1px solid #333;
                        width: 100%;
                        max-width: 400px;
                    }
                    .login-card h2 {
                        text-align: center;
                        margin-bottom: 2rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 0.5rem;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h2>Admin Console</h2>
                <div className="admin-nav">
                    <button
                        className={activeTab === 'projects' ? 'active' : ''}
                        onClick={() => setActiveTab('projects')}
                    >
                        <FaBriefcase /> Projects
                    </button>
                    <button
                        className={activeTab === 'applicants' ? 'active' : ''}
                        onClick={() => setActiveTab('applicants')}
                    >
                        <FaUser /> Applicants
                    </button>
                    <button onClick={() => setIsAuthenticated(false)}>Logout</button>
                </div>
            </header>

            <div className="admin-content">
                {activeTab === 'projects' && (
                    <div className="data-section">
                        <div className="section-header">
                            <h3>Manage Projects</h3>
                            <Button
                                variant="secondary"
                                onClick={() => openProjectModal(null)}
                            >
                                <FaPlus /> Add Project
                            </Button>
                        </div>
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Role</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.company}</td>
                                            <td>{p.role}</td>
                                            <td>{p.category}</td>
                                            <td>
                                                <button className="action-btn edit" onClick={() => openProjectModal(p)}>
                                                    <FaEdit />
                                                </button>
                                                <button className="action-btn delete" onClick={() => handleDeleteProject(p.id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'applicants' && (
                    <div className="data-section">
                        <div className="section-header">
                            <h3>Applicants</h3>
                            {/* Adding applicant manually if needed, usually comes from form */}
                            <Button variant="secondary" onClick={() => alert('Feature coming soon!')}>
                                <FaPlus /> Add Talent
                            </Button>
                        </div>
                        <div className="data-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.name}</td>
                                            <td>{a.role}</td>
                                            <td>{a.status}</td>
                                            <td>
                                                <button className="action-btn delete" onClick={() => deleteApplicant(a.id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Project Modal Overlay */}
            {isProjectModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentProject ? 'Edit Project' : 'New Project'}</h3>
                        <form onSubmit={handleProjectSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input name="company" defaultValue={currentProject?.company} required />
                                </div>
                                <div className="form-group">
                                    <label>Role / Job Title</label>
                                    <input name="role" defaultValue={currentProject?.role} required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" defaultValue={currentProject?.category}>
                                        <option>DeFi</option>
                                        <option>NFT</option>
                                        <option>DAO</option>
                                        <option>Infrastructure</option>
                                        <option>GameFi</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input name="location" defaultValue={currentProject?.location} required />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <input name="type" defaultValue={currentProject?.type} placeholder="Full-time / Contract" required />
                                </div>
                                <div className="form-group">
                                    <label>Salary</label>
                                    <input name="salary" defaultValue={currentProject?.salary} required />
                                </div>
                                <div className="form-group">
                                    <label>Logo Source</label>
                                    <div className="logo-upload-wrapper">
                                        <div className="file-upload-btn-container">
                                            <label className="custom-file-upload">
                                                <input type="file" accept="image/*" onChange={handleLogoUpload} />
                                                <span className="upload-btn-text">
                                                    {uploadedLogo ? 'Change File' : 'Upload Image'}
                                                </span>
                                            </label>
                                            <span className="file-info-text">(Max 500KB)</span>
                                        </div>
                                        {uploadedLogo && (
                                            <div className="logo-preview-container">
                                                <img src={uploadedLogo} alt="Preview" />
                                                <button type="button" className="remove-logo-btn" onClick={() => setUploadedLogo(null)}><FaTrash /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="or-divider"><span>OR</span></div>
                                    <input name="logoUrl" defaultValue={currentProject?.logoUrl} placeholder="Paste Image URL..." />
                                </div>
                                <div className="form-group">
                                    <label>Website</label>
                                    <input name="website" defaultValue={currentProject?.website} placeholder="https://..." />
                                </div>
                                <div className="form-group">
                                    <label>Public Contact Email</label>
                                    <input name="contactEmail" defaultValue={currentProject?.contactEmail} type="email" />
                                </div>
                                <div className="form-group span-2">
                                    <label>Application Notification Email (Hidden)</label>
                                    <input name="notificationEmail" defaultValue={currentProject?.notificationEmail} type="email" placeholder="Where do you want to receive applications?" />
                                </div>
                                <div className="form-group span-2">
                                    <label>Tags (comma separated)</label>
                                    <input name="tags" defaultValue={currentProject?.tags?.join(', ')} required />
                                </div>
                                <div className="form-group span-2">
                                    <label>Description</label>
                                    <textarea name="description" rows="4" defaultValue={currentProject?.description} required></textarea>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsProjectModalOpen(false)}>Cancel</button>
                                <Button variant="primary">Save Project</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-dashboard {
                    min-height: 100vh;
                    background: #000;
                    color: #fff;
                }
                .admin-header {
                    padding: 1rem 20px;
                    border-bottom: 1px solid #333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #111;
                }
                .admin-nav {
                    display: flex;
                    gap: 1rem;
                }
                .admin-nav button {
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                }
                .admin-nav button.active {
                    background: #222;
                    color: #fff;
                }

                .admin-content {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .data-table th, .data-table td {
                    text-align: left;
                    padding: 1rem;
                    border-bottom: 1px solid #222;
                }
                .data-table th {
                    color: #888;
                    font-weight: 500;
                }
                .action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    margin-right: 0.5rem;
                }
                .action-btn.edit { color: #3498db; }
                .action-btn.delete { color: #e74c3c; }
                .action-btn:hover { background: #222; }

                /* Modal */
                /* Modal Overlay */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                }

                /* Modal Content */
                .modal-content {
                    background: #161616;
                    border-radius: 12px;
                    width: 700px;
                    max-width: 100%;
                    max-height: 90vh;
                    border: 1px solid #333;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: modalFadeIn 0.3s ease;
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .modal-content h3 {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #282828;
                    margin: 0;
                    background: #161616;
                    color: #fff;
                    font-size: 1.25rem;
                }

                /* Form Header & Layout */
                .modal-content form {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    overflow: hidden;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    padding: 2rem;
                    overflow-y: auto;
                    color: #fff;
                }
                .span-2 { grid-column: span 2; }

                /* Inputs & Labels */
                .form-group label {
                    display: block;
                    margin-bottom: 0.6rem;
                    color: #888;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-group input, 
                .form-group textarea, 
                .form-group select {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background-color: #0a0a0a !important;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: #eee;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                .form-group input:focus, 
                .form-group textarea:focus, 
                .form-group select:focus {
                    border-color: var(--primary-orange);
                    outline: none;
                    background-color: #050505 !important;
                }
                
                /* File Upload Styling */
                .logo-upload-wrapper {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .file-upload-btn-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .custom-file-upload {
                    display: inline-block;
                    cursor: pointer;
                    background: #222;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    border: 1px solid #444;
                    transition: all 0.2s;
                }
                .custom-file-upload:hover {
                    background: #333;
                    border-color: #666;
                }
                .custom-file-upload input[type="file"] {
                    display: none;
                }
                .upload-btn-text {
                    font-size: 0.85rem;
                    color: #fff;
                }
                .file-info-text {
                    font-size: 0.8rem;
                    color: #555;
                }
                .logo-preview-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .logo-preview-container img {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 1px solid #444;
                }
                .remove-logo-btn {
                    background: none;
                    border: none;
                    color: #e74c3c;
                    cursor: pointer;
                    padding: 4px;
                }
                .or-divider {
                    display: flex;
                    align-items: center;
                    margin: 0.8rem 0;
                    color: #444;
                    font-size: 0.8rem;
                }
                .or-divider::before, .or-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #222;
                }
                .or-divider span {
                    padding: 0 10px;
                }

                /* Footer Actions */
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    background: #161616;
                    border-top: 1px solid #282828;
                }
                .modal-actions button {
                    padding: 0.8rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .modal-actions button:first-child {
                    background: transparent;
                    border: 1px solid #333;
                    color: #aaa;
                }
                .modal-actions button:first-child:hover {
                    border-color: #666;
                    color: #fff;
                }
                
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                        padding: 1.5rem;
                    }
                    .span-2 { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

export default Admin;
