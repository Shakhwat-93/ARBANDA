import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Upload, X, FileText, Check, AlertCircle, FileType } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BulkImportModal = ({ isOpen, onClose, onImportSuccess }) => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setError(null);
        setPreviewData([]);

        if (selectedFile) {
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        setError(`Error parsing CSV: ${results.errors[0].message}`);
                    } else {
                        // Validate headers
                        const requiredFields = ['name', 'price', 'category', 'stock'];
                        const headers = results.meta.fields;
                        const missing = requiredFields.filter(field => !headers.includes(field));

                        if (missing.length > 0) {
                            setError(`Missing required columns: ${missing.join(', ')}`);
                        } else {
                            setPreviewData(results.data.slice(0, 5)); // Preview first 5 rows
                        }
                    }
                },
                error: (err) => {
                    setError(`File read error: ${err.message}`);
                }
            });
        }
    };

    const handleImport = async () => {
        if (!file) return;
        setImporting(true);
        setError(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const productsToInsert = results.data.map(row => ({
                        name: row.name || 'Untitled Product',
                        description: row.description || '',
                        price: parseFloat(row.price) || 0,
                        category: row.category || 'Uncategorized',
                        stock: parseInt(row.stock) || 0,
                        image_url: row.image_url || 'https://placehold.co/600x400?text=No+Image'
                    }));

                    const { error: insertError } = await supabase
                        .from('products')
                        .insert(productsToInsert);

                    if (insertError) throw insertError;

                    toast.success(`Successfully imported ${productsToInsert.length} products!`);
                    onImportSuccess();
                    onClose();
                    setFile(null);
                    setPreviewData([]);
                } catch (err) {
                    console.error('Import error:', err);
                    setError(err.message || 'Failed to import products.');
                    toast.error('Import failed.');
                } finally {
                    setImporting(false);
                }
            }
        });
    };

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8," + "name,category,price,stock,description,image_url\nExample Product,Skincare,19.99,100,This is a test product,https://placehold.co/600x400";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDFFormat = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Product Import CSV Format Guide", 14, 22);

        // Description
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text("To import products in bulk, please upload a CSV file with the following columns:", 14, 32);

        // Column Definitions Table
        const columns = [
            { header: "Column Name", dataKey: "col" },
            { header: "Required", dataKey: "req" },
            { header: "Description & Format", dataKey: "desc" }
        ];

        const rows = [
            { col: "name", req: "Yes", desc: "The name of the product. Text." },
            { col: "category", req: "Yes", desc: "Product category (e.g., Skincare, Electronics). Text." },
            { col: "price", req: "Yes", desc: "Price per unit. maintain number format (e.g., 19.99)." },
            { col: "stock", req: "Yes", desc: "Quantity in stock. Integer number." },
            { col: "description", req: "No", desc: "Detailed product description. Text." },
            { col: "image_url", req: "No", desc: "Public URL to the product image." }
        ];

        doc.autoTable({
            head: [columns.map(c => c.header)],
            body: rows.map(r => [r.col, r.req, r.desc]),
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [63, 63, 70] }
        });

        // Example Data Section
        doc.text("Example CSV Data:", 14, doc.lastAutoTable.finalY + 15);

        const exampleData = [
            ["Test Product", "Skincare", "19.99", "100", "Great product", "https://example.com/image.jpg"],
            ["Another Item", "Electronics", "299.50", "15", "Top quality", ""]
        ];

        doc.autoTable({
            head: [['name', 'category', 'price', 'stock', 'description', 'image_url']],
            body: exampleData,
            startY: doc.lastAutoTable.finalY + 20,
            theme: 'striped',
            headStyles: { fillColor: [236, 72, 153] }
        });

        doc.save("product_import_format.pdf");
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div style={{
                background: '#18181b', borderRadius: '16px', border: '1px solid #27272a',
                width: '100%', maxWidth: '600px', padding: '24px', position: 'relative',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Bulk Import Products</h2>
                <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '24px' }}>Upload a CSV file to add multiple products at once.</p>

                {/* Template Download */}
                <div style={{ background: '#27272a', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                            <FileText size={18} />
                        </div>
                        <div>
                            <div style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: '500' }}>CSV Template</div>
                            <div style={{ color: '#a1a1aa', fontSize: '12px' }}>Use this format for your data</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={downloadPDFFormat} style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: '500', background: 'none', border: '1px solid #3f3f46', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileType size={14} /> PDF Guide
                        </button>
                        <button onClick={downloadTemplate} style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>Download CSV</button>
                    </div>
                </div>

                {/* File Upload Area */}
                <div style={{
                    border: '2px dashed #3f3f46', borderRadius: '12px', padding: '32px',
                    textAlign: 'center', marginBottom: '24px', cursor: 'pointer',
                    background: file ? 'rgba(39, 39, 42, 0.5)' : 'transparent',
                    transition: 'border-color 0.2s'
                }}
                    onClick={() => document.getElementById('csvInput').click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#a855f7'; }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#3f3f46'; }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = '#3f3f46';
                        const droppedFile = e.dataTransfer.files[0];
                        if (droppedFile && droppedFile.type === "text/csv") {
                            handleFileChange({ target: { files: [droppedFile] } });
                        } else {
                            toast.error("Please upload a CSV file.");
                        }
                    }}
                >
                    <input
                        type="file"
                        id="csvInput"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    {file ? (
                        <div>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <Check size={24} />
                            </div>
                            <div style={{ color: '#e4e4e7', fontWeight: '500' }}>{file.name}</div>
                            <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '4px' }}>{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#27272a', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <Upload size={24} />
                            </div>
                            <div style={{ color: '#e4e4e7', fontWeight: '500' }}>Click to upload or drag & drop</div>
                            <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '4px' }}>CSV files only</div>
                        </div>
                    )}
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Preview Table */}
                {previewData.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginBottom: '8px' }}>Preview (First 5 Rows)</div>
                        <div style={{ overflowX: 'auto', border: '1px solid #27272a', borderRadius: '8px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#a1a1aa' }}>
                                <thead>
                                    <tr style={{ background: '#27272a', color: '#e4e4e7' }}>
                                        {Object.keys(previewData[0]).map(key => (
                                            <th key={key} style={{ padding: '8px', textAlign: 'left', fontWeight: '500' }}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid #27272a' }}>
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} style={{ padding: '8px' }}>{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleImport}
                        disabled={!file || !!error || importing}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                            background: !file || !!error ? '#27272a' : 'linear-gradient(135deg, #a855f7, #ec4899)',
                            color: !file || !!error ? '#71717a' : '#fff',
                            fontWeight: '600', cursor: (!file || !!error || importing) ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        {importing ? 'Importing...' : 'Import Products'}
                    </button>
                    <button
                        onClick={onClose}
                        style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #3f3f46', background: 'transparent', color: '#e4e4e7', fontWeight: '500', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkImportModal;
