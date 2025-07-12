import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const transactions = [
	{
		id: "TXN-001",
		user: "John Doe",
		email: "john.doe@example.com",
		plan: "Pro",
		amount: 1200,
		currency: "৳",
		method: "Stripe",
		status: "Success",
		date: "2025-07-01",
		invoice: { id: "INV-001", file: "invoice-001.pdf" },
	},
	{
		id: "TXN-002",
		user: "Jane Smith",
		email: "jane.smith@example.com",
		plan: "Basic",
		amount: 800,
		currency: "৳",
		method: "bKash",
		status: "Pending",
		date: "2025-07-03",
		invoice: { id: "INV-002", file: "invoice-002.pdf" },
	},
	// Additional 10 users with some repeated users and different plans/dates
	{
		id: "TXN-003",
		user: "Alice Rahman",
		email: "alice.rahman@example.com",
		plan: "Premium",
		amount: 1500,
		currency: "৳",
		method: "Card",
		status: "Success",
		date: "2025-07-04",
		invoice: { id: "INV-003", file: "invoice-003.pdf" },
	},
	{
		id: "TXN-004",
		user: "Sabbir Hossain",
		email: "sabbir.hossain@example.com",
		plan: "Basic",
		amount: 800,
		currency: "৳",
		method: "bKash",
		status: "Success",
		date: "2025-07-05",
		invoice: { id: "INV-004", file: "invoice-004.pdf" },
	},
	{
		id: "TXN-005",
		user: "Rafiq Islam",
		email: "rafiq.islam@example.com",
		plan: "Pro",
		amount: 1200,
		currency: "৳",
		method: "Nagad",
		status: "Failed",
		date: "2025-07-06",
		invoice: { id: "INV-005", file: "invoice-005.pdf" },
	},
	{
		id: "TXN-006",
		user: "Mitu Akter",
		email: "mitu.akter@example.com",
		plan: "Premium",
		amount: 1500,
		currency: "৳",
		method: "Card",
		status: "Success",
		date: "2025-07-07",
		invoice: { id: "INV-006", file: "invoice-006.pdf" },
	},
	{
		id: "TXN-007",
		user: "Farhan Ahmed",
		email: "farhan.ahmed@example.com",
		plan: "Basic",
		amount: 800,
		currency: "৳",
		method: "bKash",
		status: "Success",
		date: "2025-07-08",
		invoice: { id: "INV-007", file: "invoice-007.pdf" },
	},
	{
		id: "TXN-008",
		user: "Restaurant BD",
		email: "info@restaurantbd.com",
		plan: "Enterprise",
		amount: 3000,
		currency: "৳",
		method: "Bank",
		status: "Success",
		date: "2025-07-09",
		invoice: { id: "INV-008", file: "invoice-008.pdf" },
	},
	{
		id: "TXN-009",
		user: "App Team",
		email: "support@app.com",
		plan: "Pro",
		amount: 1200,
		currency: "৳",
		method: "Stripe",
		status: "Pending",
		date: "2025-07-10",
		invoice: { id: "INV-009", file: "invoice-009.pdf" },
	},
	{
		id: "TXN-010",
		user: "Support Desk",
		email: "help@support.com",
		plan: "Basic",
		amount: 800,
		currency: "৳",
		method: "bKash",
		status: "Success",
		date: "2025-07-11",
		invoice: { id: "INV-010", file: "invoice-010.pdf" },
	},
	{
		id: "TXN-011",
		user: "John Doe",
		email: "john.doe@example.com",
		plan: "Basic",
		amount: 800,
		currency: "৳",
		method: "bKash",
		status: "Success",
		date: "2025-07-12",
		invoice: { id: "INV-011", file: "invoice-011.pdf" },
	},
	{
		id: "TXN-012",
		user: "Jane Smith",
		email: "jane.smith@example.com",
		plan: "Premium",
		amount: 1500,
		currency: "৳",
		method: "Card",
		status: "Success",
		date: "2025-07-13",
		invoice: { id: "INV-012", file: "invoice-012.pdf" },
	},
];

const refundRequests = [
	{
		id: "RF-001",
		user: "John Doe",
		email: "john.doe@example.com",
		amount: 1200,
		currency: "৳",
		reason: "Duplicate payment",
		date: "2025-07-05",
	},
];

function formatCurrency(amount, currency = "৳") {
	return `${currency}${amount.toLocaleString()}`;
}

export default function Billing() {
	const [showInvoice, setShowInvoice] = useState(null);
	const [showUpload, setShowUpload] = useState(false);
	const [uploadData, setUploadData] = useState({
		email: "",
		plan: "",
		amount: "",
		date: "",
		notes: "",
		file: null,
	});
const planOptions = ["Basic", "Pro", "Premium", "Enterprise"];
const methodOptions = ["Stripe", "bKash", "Card", "Nagad", "Bank"];
const [filters, setFilters] = useState({
	user: "",
	plan: "",
	method: "",
	status: "",
	date: "",
});
	const [refundAction, setRefundAction] = useState({ id: null, type: null });
	const [rejectReason, setRejectReason] = useState("");
	const navigate = useNavigate();

	const filteredTxns = transactions.filter((txn) =>
		(!filters.user ||
			txn.user.toLowerCase().includes(filters.user.toLowerCase()) ||
			txn.email.toLowerCase().includes(filters.user.toLowerCase())) &&
		(!filters.plan || txn.plan === filters.plan) &&
		(!filters.method || txn.method === filters.method) &&
		(!filters.status || txn.status === filters.status) &&
		(!filters.date || txn.date === filters.date)
	);

	// Pagination logic
	const [page, setPage] = useState(1);
	const rowsPerPage = 5;
	const totalPages = Math.ceil(filteredTxns.length / rowsPerPage);
	const paginatedTxns = filteredTxns.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	return (
		<div className="p-6 max-w-6xl mx-auto space-y-10">
			{/* Navigation */}
			<div className="flex justify-between items-center mb-6">
				<button
					className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
					onClick={() => navigate("/users")}
				>
					Back to Dashboard
				</button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 mb-4">
				<input
				className="input input-sm border border-gray-300 rounded"
					placeholder="User Name/Email"
					onChange={(e) =>
						setFilters((f) => ({ ...f, user: e.target.value }))
					}
				/>
			<select
				className="input input-sm border border-gray-300 rounded"
				value={filters.plan}
				onChange={(e) => setFilters((f) => ({ ...f, plan: e.target.value }))}
			>
				<option value="">All Plans</option>
				{planOptions.map((plan) => (
					<option key={plan} value={plan}>{plan}</option>
				))}
			</select>
			<select
				className="input input-sm border border-gray-300 rounded"
				value={filters.method}
				onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
			>
				<option value="">All Methods</option>
				{methodOptions.map((method) => (
					<option key={method} value={method}>{method}</option>
				))}
			</select>
				<select
				className="input input-sm border border-gray-300 rounded"
					onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
				>
					<option value="">All Status</option>
					<option value="Success">Success</option>
					<option value="Failed">Failed</option>
					<option value="Pending">Pending</option>
				</select>
				<input
				type="date"
				className="input input-sm border border-gray-300 rounded"
				onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
			/>
				<button
				className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 text-green-700 font-medium transition"
				onClick={() => alert("Exported as CSV/XLSX!")}
			>
				Export
			</button>
			</div>

			{/* Transaction Table with Pagination */}
			<div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
				<table className="table-auto w-full text-left">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-2">User</th>
							<th className="px-4 py-2">Email</th>
							<th className="px-4 py-2">Plan</th>
							<th className="px-4 py-2">Amount</th>
							<th className="px-4 py-2">Method</th>
							<th className="px-4 py-2">Status</th>
							<th className="px-4 py-2">Date</th>
							<th className="px-4 py-2">Invoice</th>
							<th className="px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{paginatedTxns.map((txn) => (
							<tr key={txn.id} className="border-t border-gray-100">
								<td
									className="px-4 py-2 cursor-pointer text-blue-700 hover:underline"
									onClick={() => navigate(`/user-profile?email=${txn.email}`)}
								>
									{txn.user}
								</td>
								<td className="px-4 py-2">{txn.email}</td>
								<td className="px-4 py-2">{txn.plan}</td>
								<td className="px-4 py-2">
									{formatCurrency(txn.amount, txn.currency)}
								</td>
								<td className="px-4 py-2">{txn.method}</td>
								<td className="px-4 py-2">{txn.status}</td>
								<td className="px-4 py-2">{txn.date}</td>
								<td className="px-4 py-2">
									<button
										className="btn btn-xs"
										onClick={() => setShowInvoice(txn.invoice)}
									>
										View
									</button>
								</td>
								<td className="px-4 py-2">
									<button
										className="btn btn-xs"
										onClick={() => navigate(`/user-profile?email=${txn.email}`)}
									>
										View User
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Controls */}
				<div className="flex justify-end items-center gap-2 p-4">
					<button
						className="btn btn-xs"
						disabled={page === 1}
						onClick={() => setPage(page - 1)}
					>
						Prev
					</button>
					<span className="text-sm">Page {page} of {totalPages}</span>
					<button
						className="btn btn-xs"
						disabled={page === totalPages}
						onClick={() => setPage(page + 1)}
					>
						Next
					</button>
				</div>
			</div>

			{/* Invoice Pop-up */}
			{showInvoice && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="font-bold text-lg mb-2">Invoice Details</h3>
						<div className="mb-4">Invoice ID: {showInvoice.id}</div>
						<a
							href={`/${showInvoice.file}`}
							download
							className="btn btn-sm bg-blue-100 hover:bg-blue-200 text-blue-700"
						>
							Download
						</a>
						<button
							className="btn btn-sm ml-2"
							onClick={() => setShowInvoice(null)}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Manual Invoice Upload Pop-up */}
			{showUpload && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="font-bold text-lg mb-2">Manual Invoice Upload</h3>
						<input
							className="input w-full my-2"
							placeholder="User Email"
							value={uploadData.email}
							onChange={(e) =>
								setUploadData((d) => ({ ...d, email: e.target.value }))
							}
						/>
						<input
							className="input w-full my-2"
							placeholder="Plan"
							value={uploadData.plan}
							onChange={(e) =>
								setUploadData((d) => ({ ...d, plan: e.target.value }))
							}
						/>
						<input
							className="input w-full my-2"
							placeholder="Amount"
							type="number"
							value={uploadData.amount}
							onChange={(e) =>
								setUploadData((d) => ({ ...d, amount: e.target.value }))
							}
						/>
						<input
							className="input w-full my-2"
							type="date"
							value={uploadData.date}
							onChange={(e) =>
								setUploadData((d) => ({ ...d, date: e.target.value }))
							}
						/>
						<textarea
							className="input w-full my-2"
							placeholder="Notes"
							value={uploadData.notes}
							onChange={(e) =>
								setUploadData((d) => ({ ...d, notes: e.target.value }))
							}
						/>
						<input
							className="input w-full my-2"
							type="file"
							onChange={(e) =>
								setUploadData((d) => ({ ...d, file: e.target.files[0] }))
							}
						/>
						<div className="flex justify-end gap-2 mt-4">
							<button
								className="btn"
								onClick={() => setShowUpload(false)}
							>
								Cancel
							</button>
							<button
								className="btn btn-success"
								onClick={() => {
									setShowUpload(false);
									alert("Invoice uploaded!");
								}}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Refunds & Disputes section removed as per request */}
		</div>
	);
}