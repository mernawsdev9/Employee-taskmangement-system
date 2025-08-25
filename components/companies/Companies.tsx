import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as DataService from '../../services/dataService';
import * as AuthService from '../../services/authService';
import { Company, UserRole } from '../../types';
import { Navigate } from 'react-router-dom';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { UsersIcon, ClipboardListIcon } from '../../constants';

interface CompanyWithStats extends Company {
    employeeCount: number;
    projectCount: number;
}

const CompanyCard: React.FC<{ company: CompanyWithStats }> = ({ company }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">{company.name}</h3>
                
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Details</h4>
                    <div className="flex items-center space-x-4 text-slate-700">
                        <div className="flex items-center space-x-2">
                             <UsersIcon className="h-5 w-5" />
                             <span className="font-medium">{company.employeeCount} Employees</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ClipboardListIcon />
                            <span className="font-medium">{company.projectCount} Projects</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Companies: React.FC = () => {
    const { user } = useAuth();
    const [companiesWithStats, setCompaniesWithStats] = useState<CompanyWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState('');

    const loadData = useCallback(() => {
        setIsLoading(true);
        if (!user) return;
        try {
            const companies = DataService.getCompanies();
            const users = AuthService.getUsers();
            const projects = DataService.getAllProjects();

            const stats = companies.map(comp => {
                const companyUsers = users.filter(u => u.companyId === comp.id);
                const companyProjects = projects.filter(p => p.companyId === comp.id);

                return {
                    ...comp,
                    employeeCount: companyUsers.length,
                    projectCount: companyProjects.length,
                };
            });

            setCompaniesWithStats(stats);
        } catch (error) {
            console.error("Failed to load company data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewCompanyName('');
    };

    const handleCreateCompany = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCompanyName.trim() || !user) {
            alert('Company name is required.');
            return;
        }
        DataService.createCompany(newCompanyName, user.id);
        loadData();
        handleCloseModal();
    };

    if (user?.role !== UserRole.ADMIN) {
        return <Navigate to="/" />;
    }

    if (isLoading) {
        return <div>Loading companies...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Companies</h1>
                <Button onClick={handleOpenModal}>Create New Company</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {companiesWithStats.map(comp => (
                    <CompanyCard key={comp.id} company={comp} />
                ))}
            </div>

            <Modal title="Create New Company" isOpen={isModalOpen} onClose={handleCloseModal}>
                <form onSubmit={handleCreateCompany} className="space-y-6">
                    <Input
                        id="newCompanyName"
                        label="Company Name"
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        required
                    />
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300 shadow-sm">
                            Cancel
                        </button>
                        <Button type="submit">Create Company</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Companies;
