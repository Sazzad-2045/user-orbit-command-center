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
				<button
					className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition"
					onClick={() => setShowUpload(true)}
				>
					Manual Invoice Upload
				</button>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 mb-4">
				<input
					className="input input-sm"
					placeholder="User Name/Email"
					onChange={(e) =>
						setFilters((f) => ({ ...f, user: e.target.value }))
					}
				/>
				<input
					className="input input-sm"
					placeholder="Plan"
					onChange={(e) => setFilters((f) => ({ ...f, plan: e.target.value }))}
				/>
				<input
					className="input input-sm"
					placeholder="Payment Method"
					onChange={(e) => setFilters((f) => ({ ...f, method: e.target.value }))}
				/>
				<select
					className="input input-sm"
					onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
				>
					<option value="">All Status</option>
					<option value="Success">Success</option>
					<option value="Failed">Failed</option>
					<option value="Pending">Pending</option>
				</select>
				<input
					type="date"
					className="input input-sm"
					onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
				/>
				<button
					className="btn btn-sm"
					onClick={() => alert("Exported as CSV/XLSX!")}
				>
					Export
				</button>
			</div>

			{/* Transaction Table */}
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
						{filteredTxns.map((txn) => (
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

			{/* Refunds/Disputes */}
			<section className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100">
				<h2 className="text-xl font-semibold mb-4 text-gray-800">
					Refunds & Disputes
				</h2>
				<table className="table-auto w-full text-left">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2">User</th>
							<th className="px-4 py-2">Email</th>
							<th className="px-4 py-2">Amount</th>
							<th className="px-4 py-2">Reason</th>
							<th className="px-4 py-2">Date</th>
							<th className="px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{refundRequests.map((req) => (
							<tr key={req.id} className="border-t border-gray-100">
								<td
									className="px-4 py-2 cursor-pointer text-blue-700 hover:underline"
									onClick={() => navigate(`/user-profile?email=${req.email}`)}
								>
									{req.user}
								</td>
								<td className="px-4 py-2">{req.email}</td>
								<td className="px-4 py-2">
									{formatCurrency(req.amount, req.currency)}
								</td>
								<td className="px-4 py-2">{req.reason}</td>
								<td className="px-4 py-2">{req.date}</td>
								<td className="px-4 py-2 flex gap-1">
									<button
										className="btn btn-xs bg-green-100 hover:bg-green-200 text-green-700"
										onClick={() => setRefundAction({ id: req.id, type: "approve" })}
									>
										Approve
									</button>
									<button
										className="btn btn-xs bg-red-100 hover:bg-red-200 text-red-700"
										onClick={() => setRefundAction({ id: req.id, type: "reject" })}
									>
										Reject
									</button>
									<button
										className="btn btn-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
										onClick={() => navigate(`/support-tickets?refund=${req.id}`)}
									>
										Assign to Support
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>

			{/* Refund Action Pop-up */}
			{refundAction.id && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="font-bold text-lg mb-2">
							{refundAction.type === "approve"
								? "Approve Refund"
								: "Reject Refund"}
						</h3>
						{refundAction.type === "reject" && (
							<input
								className="input w-full my-2"
								placeholder="Rejection Reason"
								value={rejectReason}
								onChange={(e) => setRejectReason(e.target.value)}
							/>
						)}
						<div className="flex justify-end gap-2 mt-4">
							<button
								className="btn"
								onClick={() => setRefundAction({ id: null, type: null })}
							>
								Cancel
							</button>
							<button
								className="btn btn-success"
								onClick={() => {
									setRefundAction({ id: null, type: null });
									alert("Refund processed!");
								}}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}