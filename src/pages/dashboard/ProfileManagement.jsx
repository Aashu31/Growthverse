import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LuEdit } from "lucide-react";

export default function ProfileManagement() {
  const { demoData, updateEntity } = useData();
  const [company, setCompany] = useState(demoData.company);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const formData = {
    name: company.name || "",
    tagline: company.tagline || "",
    description: company.description || "",
    website: company.website || "",
    contactEmail: company.contactEmail || "",
    contactPhone: company.contactPhone || "",
    businessAddress: company.businessAddress || "",
  };

  const handleSave = () => {
    const updated = {
      ...company,
      ...formData,
    };
    updateEntity("company", "company-001", updated);
    setCompany(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-primary-text dark:text-white">Company Profile</h2>
          <p className="text-secondary-text dark:text-gray-300">
            Manage your company information. Changes are stored locally for demonstration.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <LuEdit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
          <button
            onClick={() => {
              setCompany(demoData.company);
              setFormData({
                name: demoData.company.name || "",
                tagline: demoData.company.tagline || "",
                description: demoData.company.description || "",
                website: demoData.company.website || "",
                contactEmail: demoData.company.contactEmail || "",
                contactPhone: demoData.company.contactPhone || "",
                businessAddress: demoData.company.businessAddress || "",
              });
            }}
            className="px-4 py-2 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary text-primary-text dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-xl p-4 text-green-700 dark:text-green-400 text-sm">
          Profile saved locally.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card-premium p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/25">
              GV
            </div>
            <div>
              <h3 className="font-semibold text-primary-text dark:text-white">{company.name}</h3>
              <p className="text-sm text-secondary-text dark:text-gray-400">{company.tagline}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border dark:border-gray-700 bg-gray-50 dark:bg-dark-secondary">
              <p className="text-xs font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-secondary-text dark:text-gray-300 text-sm">{company.description}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wider">Website</p>
              <a href={company.website} className="text-blue-600 dark:text-electric-blue text-sm hover:underline">{company.website || "Not set"}</a>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wider">Contact Email</p>
              <p className="text-secondary-text dark:text-gray-300 text-sm">{company.contactEmail || "Not set"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wider">Contact Phone</p>
              <p className="text-secondary-text dark:text-gray-300 text-sm">{company.contactPhone || "Not set"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wider">Business Address</p>
              <p className="text-secondary-text dark:text-gray-300 text-sm">{company.businessAddress || "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="card-premium p-8">
          <h3 className="font-semibold text-primary-text dark:text-white mb-6">Social Media</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border dark:border-gray-700 bg-white dark:bg-dark-secondary">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205-.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.15-.979.497-3.03 0-4.314-1.295-.944-2.591-.863-2.591-.863C4.873 10.79 5.698 10 6.545 10c.186 0 .387.107.485.203c.494.585.896 1.01.896 1.01s1.254-.117 1.881-.167c.866-.158 1.489-.305 2.12-.305.63 0 1.224.235 1.723.574.83.583 1.41 1.435 1.67 2.237 1.06 1.436 1.584 3.304.487 4.566-1.095 1.25-2.552 1.867-4.126 1.494-.556-.416-1.292-.79-2.089-1.017.47-.285.927-.839 1.362-1.582C8.44 16.89 6.73 17.93 6.73 17.93c-.748.747-1.958 1.02-3.42 1.02-1.766 0-3.2-.988-3.2-3.919 0-.872.263-1.961.727-2.546-.04-.166-.158-.626-.11-1.205.06-.386.258-.963.61-1.557-.03-.062-.078-.194-.13-.332-.065-.244-.134-.562-.07-.997C3.58 5.102 7.023 2 12 2c4.834 0 8.747 3.267 9.537 7.698.046.26.105.612.177.975.031.152.057.304.057.462 0 .295-.013.586-.024.882-.014.375-.036.749-.036 1.123 0 .988.317 1.922-.853 2.473-.348.164-.665.272-.993.38-.293-.107-.594-.25-.84-.453-.23-.193-.427-.465-.573-.822-.064-.157-.168-.394-.168-.635 0-.392.193-.749.524-1.006.09-.074.178-.172.23-.297.147-.347.22-.699.22-1.064 0-.667-.251-1.288-.705-1.787-.212-.236-.456-.368-.73-.408-.354-.05-.712-.04-1.078-.007-.436.04-.816.129-1.13.254-.394.16-.707.37-.96.596-.296.266-.528.59-.645.91-.155.4-.25.817-.25 1.248 0 .436.133.862.357 1.233.168.28.292.554.326.827.01.106.014.212.014.318 0 .604-.126 1.19-.38 1.727-.208.44-.48.82-.836 1.12-.187.157-.368.273-.549.374-.225.126-.449.234-.672.326-.313.129-.637.226-.967.288-.094.014-.185.034-.278.053a11 11 0 00-.607.17c-.236.081-.475.157-.705.238-.17.06-.342.117-.51.176-.192.067-.382.132-.57.2-.226.084-.447.168-.669.256-.271.109-.538.208-.805.31-.209.078-.411.154-.616.232-.23.09-.457.178-.683.267-.238.094-.474.185-.707.277-.135.054-.267.107-.4.16-.287.115-.575.23-.865.345-.122.048-.243.093-.365.14-.318.123-.635.245-.956.366-.111.042-.219.083-.329.125-.345.13-.69.26-1.037.388-.116.043-.23.086-.344.129-.357.133-.714.264-1.072.392-.12.043-.239.084-.357.127a11 11 0 00-1.126.243c-.313.058-.626.105-.937.152a12 12 0 01-.464.065c-.181.03-.362.057-.542.083a12 12 0 01-1.055.14c-.312.035-.623.062-.933.088a12 12 0 01-1.047.086c-.324.021-.647.034-.969.047a12 12 0 01-1.046.038c-.333.009-.665.01-0.997.012h-.002c-4.834 0-8.747-3.267-9.537-7.698" /></svg>
              </div>
              <span className="text-secondary-text dark:text-gray-300 text-sm">{company.socialMedia.github || "Not set"}</span>
            </div>
          </div>
          <p className="text-xs text-secondary-text dark:text-gray-400 mt-6">
            Social media URLs use placeholders. No official social accounts are configured.
          </p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Company Profile"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); setIsModalOpen(false); }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-text dark:text-white">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-text dark:text-white">Business Address</label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border dark:border-gray-600 bg-white dark:bg-gray-800 text-primary-text dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            />
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function setFormData(data) {
  // placeholder - not used directly, kept for clarity
}
