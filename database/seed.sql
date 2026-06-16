-- ============================================================
-- PublicHealth Disease Surveillance Cloud
-- Seed Data v1.0 — Realistic Public Health Data for Maharashtra
-- Run AFTER schema.sql
-- ============================================================

USE publichealth_cloud;

-- ============================================================
-- REGIONS (10 rows)
-- ============================================================
INSERT INTO regions (name, state, country, population, area_sq_km, is_current, priority, status, health_centers, hospitals, description) VALUES
('Mumbai',     'Maharashtra', 'India', 20667656, 603.40,   1, 1,  'active',  45, 89, 'Financial capital, highest density zone'),
('Pune',       'Maharashtra', 'India', 7276000,  15642.00, 1, 2,  'active',  32, 52, 'IT hub and educational center'),
('Nashik',     'Maharashtra', 'India', 2552000,  15582.00, 1, 3,  'active',  18, 24, 'Wine capital, pilgrim destination'),
('Nagpur',     'Maharashtra', 'India', 2936857,  227.00,   1, 4,  'active',  21, 31, 'Orange city, Central India hub'),
('Thane',      'Maharashtra', 'India', 1886941,  147.00,   1, 5,  'active',  14, 19, 'Industrial suburb of Mumbai'),
('Aurangabad', 'Maharashtra', 'India', 1175116,  139.00,   1, 6,  'active',  12, 16, 'Industrial and tourism hub'),
('Kolhapur',   'Maharashtra', 'India', 549236,   67.00,    1, 7,  'active',  8,  11, 'Known for Kolhapuri chappal and sugar industry'),
('Solapur',    'Maharashtra', 'India', 951118,   114.84,   1, 8,  'active',  7,  10, 'Textile and agriculture hub'),
('Satara',     'Maharashtra', 'India', 320285,   791.72,   1, 9,  'active',  5,  7,  'Historic hill station region'),
('Jalgaon',    'Maharashtra', 'India', 460228,   179.00,   1, 10, 'active',  4,  6,  'Banana cultivation capital'),
('Delhi',      'Delhi',       'India', 32941000, 1484.00,  0, 1,  'planned', 0,  0,  'National capital — Phase 2 expansion planned Q3 2025'),
('Bangalore',  'Karnataka',   'India', 13608000, 741.00,   0, 2,  'planned', 0,  0,  'Silicon Valley of India — Phase 2 expansion planned Q3 2025'),
('Hyderabad',  'Telangana',   'India', 10268653, 650.00,   0, 3,  'planned', 0,  0,  'Pharma hub — Phase 3 expansion planned Q1 2026'),
('Chennai',    'Tamil Nadu',  'India', 11503293, 426.00,   0, 4,  'planned', 0,  0,  'South India hub — Phase 3 expansion planned Q1 2026');

-- ============================================================
-- USERS (20 rows) — passwords are all: Admin@123
-- bcrypt hash of Admin@123 with 10 rounds
-- ============================================================
INSERT INTO users (username, email, password_hash, full_name, role, phone, region, department, is_active) VALUES
('admin',         'admin@publichealthcloud.in',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Arjun Mehta',       'admin',   '9876543210', 'Mumbai',     'Administration',    1),
('manager_mum',   'manager.mumbai@publichealthcloud.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Priya Sharma',      'manager', '9876543211', 'Mumbai',     'Epidemiology',      1),
('manager_pune',  'manager.pune@publichealthcloud.in',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Rahul Desai',       'manager', '9876543212', 'Pune',       'Epidemiology',      1),
('staff_mum_1',   'staff1.mumbai@publichealthcloud.in',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Anita Joshi',           'staff',   '9876543213', 'Mumbai',     'Field Operations',  1),
('staff_mum_2',   'staff2.mumbai@publichealthcloud.in',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vikram Patil',          'staff',   '9876543214', 'Mumbai',     'Field Operations',  1),
('staff_pune_1',  'staff1.pune@publichealthcloud.in',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sneha Kulkarni',        'staff',   '9876543215', 'Pune',       'Data Entry',        1),
('staff_nashik',  'staff.nashik@publichealthcloud.in',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rajesh Wagh',           'staff',   '9876543216', 'Nashik',     'Field Operations',  1),
('staff_nagpur',  'staff.nagpur@publichealthcloud.in',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pooja Rane',            'staff',   '9876543217', 'Nagpur',     'Data Entry',        1),
('staff_thane',   'staff.thane@publichealthcloud.in',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Amit Chavan',           'staff',   '9876543218', 'Thane',      'Field Operations',  1),
('staff_aurang',  'staff.aurang@publichealthcloud.in',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kavita Salunke',        'staff',   '9876543219', 'Aurangabad', 'Field Operations',  1),
('manager_nag',   'manager.nagpur@publichealthcloud.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Suresh Bhattacharya','manager','9876543220', 'Nagpur',     'Epidemiology',      1),
('staff_kolha',   'staff.kolha@publichealthcloud.in',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Meera Kore',            'staff',   '9876543221', 'Kolhapur',   'Data Entry',        1),
('staff_solapur', 'staff.solapur@publichealthcloud.in',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nikhil More',           'staff',   '9876543222', 'Solapur',    'Field Operations',  1),
('staff_satara',  'staff.satara@publichealthcloud.in',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sunita Pawar',          'staff',   '9876543223', 'Satara',     'Data Entry',        1),
('staff_jalgaon', 'staff.jalgaon@publichealthcloud.in',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Deepak Borse',          'staff',   '9876543224', 'Jalgaon',    'Field Operations',  1),
('dr_epi_1',      'epi1@publichealthcloud.in',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Lalita Iyer',       'manager', '9876543225', 'Mumbai',     'Epidemiology',      1),
('dr_epi_2',      'epi2@publichealthcloud.in',           '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Santosh Kamble',    'staff',   '9876543226', 'Pune',       'Epidemiology',      1),
('analyst_1',     'analyst1@publichealthcloud.in',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ritu Agarwal',          'staff',   '9876543227', 'Mumbai',     'Data Analytics',    1),
('analyst_2',     'analyst2@publichealthcloud.in',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kiran Nair',            'staff',   '9876543228', 'Pune',       'Data Analytics',    1),
('admin_it',      'itadmin@publichealthcloud.in',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Gaurav Shetty',         'admin',   '9876543229', 'Mumbai',     'IT Infrastructure', 1);

-- NOTE: The password_hash above is a bcrypt hash of the string "password".
-- Generated with: bcrypt.hashSync('password', 10)
-- After import, all users can login with password: password
-- To change to Admin@123, run: node backend/utils/fix-passwords.js
-- Default login credentials:
--   admin / password        (Admin role)
--   manager_mum / password  (Manager role)
--   staff_mum_1 / password  (Staff role)

-- ============================================================
-- DISEASE CASES (100 rows)
-- ============================================================
INSERT INTO disease_cases (case_id, disease_name, patient_id, region, status, severity, date_reported, description, age, gender, hospitalized, vaccination_status, created_by) VALUES
('CASE-2024-001', 'Dengue', 'PAT-10001', 'Mumbai', 'recovered', 'moderate', '2024-01-05', 'Patient presented with high fever, rash, and joint pain. Dengue NS1 positive.', 32, 'male',   1, 'vaccinated',   4),
('CASE-2024-002', 'Malaria', 'PAT-10002', 'Pune', 'recovered', 'mild', '2024-01-08', 'Plasmodium vivax detected. Patient responded well to chloroquine.', 24, 'female', 0, 'unknown',      6),
('CASE-2024-003', 'COVID-19', 'PAT-10003', 'Mumbai', 'recovered', 'severe', '2024-01-10', 'COVID-19 with respiratory complications. Required oxygen support.', 65, 'male',   1, 'vaccinated',   5),
('CASE-2024-004', 'Tuberculosis', 'PAT-10004', 'Nashik', 'active', 'moderate', '2024-01-12', 'Active pulmonary tuberculosis. DOTS therapy initiated.', 45, 'male',   0, 'unvaccinated', 7),
('CASE-2024-005', 'Influenza', 'PAT-10005', 'Nagpur', 'recovered', 'mild', '2024-01-14', 'Seasonal influenza H3N2. Recovered within 7 days.', 28, 'female', 0, 'vaccinated',   8),
('CASE-2024-006', 'Chikungunya', 'PAT-10006', 'Thane', 'active', 'moderate', '2024-01-16', 'Joint pain and high fever. Chikungunya confirmed.', 38, 'male',   0, 'unknown',      9),
('CASE-2024-007', 'Dengue', 'PAT-10007', 'Aurangabad', 'recovered', 'mild', '2024-01-18', 'Dengue fever with low platelet count. Managed conservatively.', 19, 'female', 1, 'unknown',      10),
('CASE-2024-008', 'COVID-19', 'PAT-10008', 'Pune', 'recovered', 'moderate', '2024-01-20', 'COVID-19 variant BA.5. Mild pneumonia on CT scan.', 52, 'male',   1, 'vaccinated',   6),
('CASE-2024-009', 'Malaria', 'PAT-10009', 'Mumbai', 'active', 'severe', '2024-01-22', 'Plasmodium falciparum. Complicated malaria with cerebral involvement.', 42, 'male',   1, 'unknown',      4),
('CASE-2024-010', 'Tuberculosis', 'PAT-10010', 'Nagpur', 'active', 'moderate', '2024-01-25', 'Multi-drug resistant TB suspected. Awaiting DST results.', 36, 'female', 1, 'unvaccinated', 11),
('CASE-2024-011', 'Dengue', 'PAT-10011', 'Kolhapur', 'recovered', 'mild', '2024-02-02', 'Classic dengue fever. Full recovery in 10 days.', 25, 'female', 0, 'unknown',      12),
('CASE-2024-012', 'Influenza', 'PAT-10012', 'Solapur', 'recovered', 'mild', '2024-02-05', 'Influenza A. Oseltamivir prescribed.', 35, 'male',   0, 'vaccinated',   13),
('CASE-2024-013', 'Chikungunya', 'PAT-10013', 'Satara', 'recovered', 'moderate', '2024-02-08', 'Joint involvement with prolonged arthralgia.', 55, 'female', 0, 'unknown',      14),
('CASE-2024-014', 'COVID-19', 'PAT-10014', 'Jalgaon', 'recovered', 'mild', '2024-02-10', 'Mild COVID-19. Home isolation for 14 days.', 29, 'male',   0, 'vaccinated',   15),
('CASE-2024-015', 'Malaria', 'PAT-10015', 'Mumbai', 'recovered', 'moderate', '2024-02-12', 'Vivax malaria with anemia. Iron supplementation given.', 47, 'female', 1, 'unknown',      4),
('CASE-2024-016', 'Dengue', 'PAT-10016', 'Pune', 'active', 'critical', '2024-02-15', 'Dengue hemorrhagic fever. ICU admission required.', 8, 'male',   1, 'unknown',      6),
('CASE-2024-017', 'Tuberculosis', 'PAT-10017', 'Nashik', 'active', 'severe', '2024-02-18', 'Extensive pulmonary TB with pleural effusion.', 62, 'male',   1, 'unvaccinated', 7),
('CASE-2024-018', 'COVID-19', 'PAT-10018', 'Thane', 'recovered', 'moderate', '2024-02-20', 'Post-COVID complications. Long COVID symptoms.', 48, 'female', 0, 'vaccinated',   9),
('CASE-2024-019', 'Influenza', 'PAT-10019', 'Nagpur', 'recovered', 'mild', '2024-02-22', 'Secondary bacterial pneumonia following influenza.', 71, 'male',   1, 'vaccinated',   8),
('CASE-2024-020', 'Chikungunya', 'PAT-10020', 'Aurangabad', 'active', 'moderate', '2024-02-24', 'Persistent joint swelling. Referred to rheumatology.', 44, 'female', 0, 'unknown',      10),
('CASE-2024-021', 'Dengue', 'PAT-10021', 'Mumbai', 'recovered', 'moderate', '2024-03-01', 'Dengue with thrombocytopenia. Platelet transfusion given.', 33, 'male',   1, 'unknown',      4),
('CASE-2024-022', 'Malaria', 'PAT-10022', 'Pune', 'recovered', 'mild', '2024-03-04', 'P. vivax. Standard treatment with primaquine.', 27, 'male',   0, 'unknown',      6),
('CASE-2024-023', 'COVID-19', 'PAT-10023', 'Nashik', 'deceased', 'critical', '2024-03-07', 'Severe COVID-19 with ARDS. Ventilator support. Patient expired.', 78, 'male',   1, 'unvaccinated', 7),
('CASE-2024-024', 'Tuberculosis', 'PAT-10024', 'Kolhapur', 'active', 'mild', '2024-03-10', 'Latent TB reactivation. Starting preventive therapy.', 38, 'female', 0, 'vaccinated',   12),
('CASE-2024-025', 'Influenza', 'PAT-10025', 'Solapur', 'recovered', 'mild', '2024-03-13', 'Influenza B. Symptomatic treatment.', 22, 'female', 0, 'unknown',      13),
('CASE-2024-026', 'Chikungunya', 'PAT-10026', 'Mumbai', 'recovered', 'mild', '2024-03-16', 'Acute chikungunya. Complete recovery in 3 weeks.', 31, 'male',   0, 'unknown',      4),
('CASE-2024-027', 'Dengue', 'PAT-10027', 'Nagpur', 'active', 'moderate', '2024-03-19', 'Dengue shock syndrome. ICU admission.', 15, 'female', 1, 'unknown',      11),
('CASE-2024-028', 'Malaria', 'PAT-10028', 'Thane', 'recovered', 'moderate', '2024-03-22', 'Falciparum malaria. IV artesunate administered.', 53, 'male',   1, 'unknown',      9),
('CASE-2024-029', 'COVID-19', 'PAT-10029', 'Aurangabad', 'recovered', 'mild', '2024-03-25', 'Omicron variant. Mild illness. Home isolation.', 36, 'female', 0, 'vaccinated',   10),
('CASE-2024-030', 'Tuberculosis', 'PAT-10030', 'Jalgaon', 'active', 'moderate', '2024-03-28', 'New pulmonary TB case. RNTCP registration done.', 41, 'male',   0, 'unvaccinated', 15),
('CASE-2024-031', 'Dengue', 'PAT-10031', 'Pune', 'recovered', 'mild', '2024-04-02', 'Dengue fever. Managed with oral hydration.', 18, 'male',   0, 'unknown',      6),
('CASE-2024-032', 'Malaria', 'PAT-10032', 'Mumbai', 'active', 'severe', '2024-04-05', 'Severe malaria with jaundice and renal involvement.', 49, 'male',   1, 'unknown',      4),
('CASE-2024-033', 'COVID-19', 'PAT-10033', 'Nashik', 'recovered', 'moderate', '2024-04-08', 'COVID-19 with diabetes complication.', 60, 'female', 1, 'vaccinated',   7),
('CASE-2024-034', 'Influenza', 'PAT-10034', 'Satara', 'recovered', 'mild', '2024-04-11', 'Seasonal flu. Full recovery.', 26, 'male',   0, 'vaccinated',   14),
('CASE-2024-035', 'Chikungunya', 'PAT-10035', 'Nagpur', 'active', 'moderate', '2024-04-14', 'Chikungunya with neurological complications.', 58, 'female', 1, 'unknown',      11),
('CASE-2024-036', 'Dengue', 'PAT-10036', 'Kolhapur', 'recovered', 'mild', '2024-04-17', 'Secondary dengue infection. Severe thrombocytopenia.', 40, 'male',   1, 'unknown',      12),
('CASE-2024-037', 'Tuberculosis', 'PAT-10037', 'Solapur', 'active', 'severe', '2024-04-20', 'Disseminated TB. Multiple organ involvement.', 33, 'male',   1, 'unvaccinated', 13),
('CASE-2024-038', 'COVID-19', 'PAT-10038', 'Thane', 'deceased', 'critical', '2024-04-23', 'Severe COVID-19. MOF. Patient expired on day 12.', 82, 'female', 1, 'unvaccinated', 9),
('CASE-2024-039', 'Malaria', 'PAT-10039', 'Aurangabad', 'recovered', 'mild', '2024-04-26', 'P. vivax. Standard 3-day chloroquine therapy.', 30, 'female', 0, 'unknown',      10),
('CASE-2024-040', 'Influenza', 'PAT-10040', 'Jalgaon', 'recovered', 'mild', '2024-04-29', 'H1N1 influenza. Oseltamivir 5 days.', 44, 'male',   0, 'vaccinated',   15),
('CASE-2024-041', 'Dengue', 'PAT-10041', 'Mumbai', 'active', 'critical', '2024-05-03', 'Dengue with multi-organ failure. Critical condition.', 55, 'male',   1, 'unknown',      4),
('CASE-2024-042', 'Chikungunya', 'PAT-10042', 'Pune', 'recovered', 'mild', '2024-05-06', 'Acute chikungunya. Joint symptoms resolved.', 37, 'female', 0, 'unknown',      6),
('CASE-2024-043', 'COVID-19', 'PAT-10043', 'Nashik', 'recovered', 'mild', '2024-05-09', 'COVID-19 reinfection. Mild illness.', 43, 'male',   0, 'vaccinated',   7),
('CASE-2024-044', 'Tuberculosis', 'PAT-10044', 'Nagpur', 'active', 'moderate', '2024-05-12', 'Extra-pulmonary TB (lymph node). Biopsy confirmed.', 29, 'female', 0, 'unvaccinated', 11),
('CASE-2024-045', 'Malaria', 'PAT-10045', 'Thane', 'recovered', 'moderate', '2024-05-15', 'Mixed malaria infection. Combination therapy used.', 50, 'male',   1, 'unknown',      9),
('CASE-2024-046', 'Influenza', 'PAT-10046', 'Kolhapur', 'recovered', 'mild', '2024-05-18', 'Influenza with secondary sinusitis.', 34, 'female', 0, 'vaccinated',   12),
('CASE-2024-047', 'Dengue', 'PAT-10047', 'Solapur', 'recovered', 'moderate', '2024-05-21', 'Dengue with platelet count 40,000. Conservative management.', 21, 'male',   1, 'unknown',      13),
('CASE-2024-048', 'COVID-19', 'PAT-10048', 'Satara', 'recovered', 'moderate', '2024-05-24', 'COVID-19 with bacterial co-infection.', 67, 'male',   1, 'vaccinated',   14),
('CASE-2024-049', 'Chikungunya', 'PAT-10049', 'Jalgaon', 'active', 'mild', '2024-05-27', 'Mild chikungunya. Symptomatic treatment.', 26, 'female', 0, 'unknown',      15),
('CASE-2024-050', 'Tuberculosis', 'PAT-10050', 'Mumbai', 'active', 'severe', '2024-05-30', 'Drug-resistant TB. Bedaquiline regimen started.', 38, 'male',   1, 'vaccinated',   4),
('CASE-2024-051', 'Dengue', 'PAT-10051', 'Pune', 'recovered', 'mild', '2024-06-03', 'Dengue. Platelet recovered without transfusion.', 16, 'male',   0, 'unknown',      6),
('CASE-2024-052', 'Malaria', 'PAT-10052', 'Nashik', 'recovered', 'mild', '2024-06-06', 'Vivax malaria. 14-day primaquine course.', 39, 'female', 0, 'unknown',      7),
('CASE-2024-053', 'COVID-19', 'PAT-10053', 'Nagpur', 'active', 'moderate', '2024-06-09', 'Post-COVID myocarditis. Cardiology follow-up.', 56, 'male',   1, 'vaccinated',   11),
('CASE-2024-054', 'Influenza', 'PAT-10054', 'Thane', 'recovered', 'mild', '2024-06-12', 'Influenza H3N2. Self-limiting illness.', 31, 'female', 0, 'unknown',      9),
('CASE-2024-055', 'Chikungunya', 'PAT-10055', 'Aurangabad', 'recovered', 'moderate', '2024-06-15', 'Chikungunya with persistent arthritis 3 months.', 61, 'male',   0, 'unknown',      10),
('CASE-2024-056', 'Dengue', 'PAT-10056', 'Kolhapur', 'active', 'severe', '2024-06-18', 'Dengue with plasma leakage. ICU care.', 12, 'female', 1, 'unknown',      12),
('CASE-2024-057', 'Tuberculosis', 'PAT-10057', 'Solapur', 'active', 'moderate', '2024-06-21', 'Pulmonary TB. Sputum positive.', 47, 'male',   0, 'unvaccinated', 13),
('CASE-2024-058', 'COVID-19', 'PAT-10058', 'Satara', 'recovered', 'mild', '2024-06-24', 'COVID-19. Recovered in 2 weeks.', 23, 'female', 0, 'vaccinated',   14),
('CASE-2024-059', 'Malaria', 'PAT-10059', 'Jalgaon', 'recovered', 'moderate', '2024-06-27', 'Falciparum malaria. Artemether-lumefantrine therapy.', 45, 'male',   1, 'unknown',      15),
('CASE-2024-060', 'Influenza', 'PAT-10060', 'Mumbai', 'recovered', 'mild', '2024-06-30', 'Influenza B. Supportive care.', 28, 'male',   0, 'vaccinated',   5),
('CASE-2024-061', 'Dengue', 'PAT-10061', 'Pune', 'recovered', 'moderate', '2024-07-04', 'Classic dengue with rash. Full recovery.', 42, 'female', 0, 'unknown',      16),
('CASE-2024-062', 'Chikungunya', 'PAT-10062', 'Nashik', 'active', 'mild', '2024-07-07', 'Joint pain and fever. Under observation.', 35, 'male',   0, 'unknown',      7),
('CASE-2024-063', 'COVID-19', 'PAT-10063', 'Nagpur', 'deceased', 'critical', '2024-07-10', 'Severe COVID-19 with septic shock.', 75, 'male',   1, 'unvaccinated', 11),
('CASE-2024-064', 'Tuberculosis', 'PAT-10064', 'Thane', 'active', 'mild', '2024-07-13', 'Newly diagnosed pulmonary TB. DOTS initiated.', 30, 'female', 0, 'unvaccinated', 9),
('CASE-2024-065', 'Malaria', 'PAT-10065', 'Aurangabad', 'recovered', 'mild', '2024-07-16', 'P. vivax. Treatment completed.', 24, 'male',   0, 'unknown',      10),
('CASE-2024-066', 'Dengue', 'PAT-10066', 'Kolhapur', 'recovered', 'moderate', '2024-07-19', 'Dengue fever. Hospital stay 5 days.', 52, 'male',   1, 'unknown',      12),
('CASE-2024-067', 'COVID-19', 'PAT-10067', 'Solapur', 'recovered', 'moderate', '2024-07-22', 'COVID-19 with GI symptoms.', 46, 'female', 0, 'vaccinated',   13),
('CASE-2024-068', 'Influenza', 'PAT-10068', 'Satara', 'recovered', 'mild', '2024-07-25', 'Influenza. No complications.', 19, 'male',   0, 'vaccinated',   14),
('CASE-2024-069', 'Chikungunya', 'PAT-10069', 'Jalgaon', 'active', 'moderate', '2024-07-28', 'Chikungunya with severe joint pain.', 63, 'female', 0, 'unknown',      15),
('CASE-2024-070', 'Malaria', 'PAT-10070', 'Mumbai', 'active', 'moderate', '2024-07-31', 'Malaria in pregnant woman. Special protocol.', 27, 'female', 1, 'unknown',      4),
('CASE-2024-071', 'Dengue', 'PAT-10071', 'Pune', 'recovered', 'mild', '2024-08-03', 'Dengue. Oral rehydration. Full recovery.', 33, 'male',   0, 'unknown',      6),
('CASE-2024-072', 'Tuberculosis', 'PAT-10072', 'Nashik', 'active', 'moderate', '2024-08-06', 'Sputum AFB 3+ positive. RNTCP enrolled.', 54, 'male',   0, 'unvaccinated', 7),
('CASE-2024-073', 'COVID-19', 'PAT-10073', 'Nagpur', 'recovered', 'mild', '2024-08-09', 'Mild COVID-19 with fever 3 days.', 39, 'female', 0, 'vaccinated',   11),
('CASE-2024-074', 'Influenza', 'PAT-10074', 'Thane', 'recovered', 'mild', '2024-08-12', 'Influenza A. Recovered well.', 57, 'male',   0, 'vaccinated',   9),
('CASE-2024-075', 'Chikungunya', 'PAT-10075', 'Aurangabad', 'recovered', 'mild', '2024-08-15', 'Chikungunya. Joint pain subsided.', 41, 'male',   0, 'unknown',      10),
('CASE-2024-076', 'Dengue', 'PAT-10076', 'Kolhapur', 'recovered', 'moderate', '2024-08-18', 'Dengue fever with dehydration.', 22, 'female', 1, 'unknown',      12),
('CASE-2024-077', 'Malaria', 'PAT-10077', 'Solapur', 'recovered', 'mild', '2024-08-21', 'Vivax malaria. Standard treatment.', 36, 'male',   0, 'unknown',      13),
('CASE-2024-078', 'COVID-19', 'PAT-10078', 'Satara', 'active', 'moderate', '2024-08-24', 'COVID-19 with pre-existing COPD.', 70, 'male',   1, 'vaccinated',   14),
('CASE-2024-079', 'Tuberculosis', 'PAT-10079', 'Jalgaon', 'active', 'severe', '2024-08-27', 'TB meningitis. ICU admission. Poor prognosis.', 25, 'male',   1, 'unvaccinated', 15),
('CASE-2024-080', 'Influenza', 'PAT-10080', 'Mumbai', 'recovered', 'mild', '2024-08-30', 'H1N1. Oseltamivir. Full recovery.', 48, 'female', 0, 'vaccinated',   4),
('CASE-2024-081', 'Dengue', 'PAT-10081', 'Pune', 'active', 'moderate', '2024-09-02', 'Dengue with liver enzyme elevation.', 29, 'male',   1, 'unknown',      6),
('CASE-2024-082', 'Chikungunya', 'PAT-10082', 'Nashik', 'recovered', 'mild', '2024-09-05', 'Mild chikungunya. NSAIDs prescribed.', 44, 'female', 0, 'unknown',      7),
('CASE-2024-083', 'COVID-19', 'PAT-10083', 'Nagpur', 'recovered', 'mild', '2024-09-08', 'COVID-19 booster recipient. Mild illness.', 32, 'male',   0, 'vaccinated',   11),
('CASE-2024-084', 'Malaria', 'PAT-10084', 'Thane', 'active', 'severe', '2024-09-11', 'Cerebral malaria. Neuro-ICU admission.', 58, 'male',   1, 'unknown',      9),
('CASE-2024-085', 'Tuberculosis', 'PAT-10085', 'Aurangabad', 'active', 'moderate', '2024-09-14', 'AFB positive. DOTS category 1.', 43, 'female', 0, 'unvaccinated', 10),
('CASE-2024-086', 'Dengue', 'PAT-10086', 'Kolhapur', 'recovered', 'mild', '2024-09-17', 'Dengue self-limiting illness.', 20, 'male',   0, 'unknown',      12),
('CASE-2024-087', 'COVID-19', 'PAT-10087', 'Solapur', 'recovered', 'moderate', '2024-09-20', 'COVID-19 with cardiac dysrhythmia.', 64, 'female', 1, 'vaccinated',   13),
('CASE-2024-088', 'Influenza', 'PAT-10088', 'Satara', 'recovered', 'mild', '2024-09-23', 'Influenza B. No complications.', 37, 'male',   0, 'vaccinated',   14),
('CASE-2024-089', 'Malaria', 'PAT-10089', 'Jalgaon', 'recovered', 'mild', '2024-09-26', 'P. malariae. Chloroquine-sensitive.', 51, 'male',   0, 'unknown',      15),
('CASE-2024-090', 'Chikungunya', 'PAT-10090', 'Mumbai', 'active', 'moderate', '2024-09-29', 'Chikungunya with myocarditis.', 49, 'male',   1, 'unknown',      4),
('CASE-2024-091', 'Dengue', 'PAT-10091', 'Pune', 'recovered', 'moderate', '2024-10-02', 'Secondary dengue. DHF managed.', 67, 'male',   1, 'unknown',      6),
('CASE-2024-092', 'Tuberculosis', 'PAT-10092', 'Nashik', 'active', 'mild', '2024-10-05', 'Screen-detected TB. Asymptomatic.', 35, 'female', 0, 'vaccinated',   7),
('CASE-2024-093', 'COVID-19', 'PAT-10093', 'Nagpur', 'active', 'moderate', '2024-10-08', 'Long COVID neurological symptoms.', 46, 'male',   0, 'vaccinated',   11),
('CASE-2024-094', 'Malaria', 'PAT-10094', 'Thane', 'recovered', 'moderate', '2024-10-11', 'Mixed falciparum vivax. Dual therapy.', 38, 'female', 1, 'unknown',      9),
('CASE-2024-095', 'Influenza', 'PAT-10095', 'Aurangabad', 'recovered', 'mild', '2024-10-14', 'Influenza with upper respiratory infection.', 28, 'male',   0, 'vaccinated',   10),
('CASE-2024-096', 'Dengue', 'PAT-10096', 'Kolhapur', 'active', 'severe', '2024-10-17', 'Dengue with multi-system involvement.', 23, 'male',   1, 'unknown',      12),
('CASE-2024-097', 'Chikungunya', 'PAT-10097', 'Solapur', 'recovered', 'mild', '2024-10-20', 'Chikungunya. Joint symptoms improving.', 55, 'female', 0, 'unknown',      13),
('CASE-2024-098', 'COVID-19', 'PAT-10098', 'Satara', 'deceased', 'critical', '2024-10-23', 'Severe COVID-19. Immunocompromised patient expired.', 73, 'male',   1, 'unvaccinated', 14),
('CASE-2024-099', 'Tuberculosis', 'PAT-10099', 'Jalgaon', 'active', 'moderate', '2024-10-26', 'New case. AFB microscopy positive.', 40, 'male',   0, 'unvaccinated', 15),
('CASE-2024-100', 'Malaria', 'PAT-10100', 'Mumbai', 'active', 'moderate', '2024-10-29', 'Falciparum malaria. Treatment ongoing.', 34, 'male',   1, 'unknown',      4);

-- ============================================================
-- REPORTS (30 rows)
-- ============================================================
INSERT INTO reports (report_id, title, report_type, period_start, period_end, region, summary, status, created_by) VALUES
('RPT-2024-001', 'Mumbai January Daily Disease Report', 'daily', '2024-01-05', '2024-01-05', 'Mumbai', 'Daily surveillance report for Mumbai. 3 new cases reported.', 'approved', 4),
('RPT-2024-002', 'Maharashtra Weekly Epidemiology Summary W3', 'weekly', '2024-01-15', '2024-01-21', 'All', 'Weekly summary: 12 new cases, 8 recoveries across Maharashtra.', 'approved', 2),
('RPT-2024-003', 'January 2024 Monthly Health Report', 'monthly', '2024-01-01', '2024-01-31', 'All', 'Monthly report: Dengue surge noted in Mumbai. Total 20 new cases.', 'approved', 2),
('RPT-2024-004', 'Dengue Outbreak Alert - Mumbai', 'outbreak', '2024-02-01', '2024-02-28', 'Mumbai', 'Dengue outbreak detected in Dharavi and Kurla zones.', 'approved', 3),
('RPT-2024-005', 'Pune February Weekly Report W7', 'weekly', '2024-02-12', '2024-02-18', 'Pune', 'Weekly Pune: 5 new dengue, 3 COVID-19 recoveries.', 'under_review', 6),
('RPT-2024-006', 'February 2024 Monthly Summary', 'monthly', '2024-02-01', '2024-02-29', 'All', 'February summary: TB cases rising in Nashik. 18 active cases.', 'approved', 2),
('RPT-2024-007', 'Nashik TB Cluster Investigation', 'outbreak', '2024-03-01', '2024-03-15', 'Nashik', 'TB cluster investigation in Nashik industrial zone. 4 linked cases.', 'approved', 7),
('RPT-2024-008', 'March 2024 Monthly Health Summary', 'monthly', '2024-03-01', '2024-03-31', 'All', 'March: COVID-19 cases declining. Malaria cases increasing seasonally.', 'approved', 3),
('RPT-2024-009', 'Q1 2024 Quarterly Epidemiology Review', 'custom', '2024-01-01', '2024-03-31', 'All', 'Q1 2024: 30 cases across Maharashtra. Recovery rate 70%. 3 deaths.', 'approved', 2),
('RPT-2024-010', 'Nagpur Malaria Weekly Alert', 'weekly', '2024-04-01', '2024-04-07', 'Nagpur', 'Malaria alert: 3 new falciparum cases in Nagpur East zone.', 'under_review', 11),
('RPT-2024-011', 'April 2024 Monthly Report', 'monthly', '2024-04-01', '2024-04-30', 'All', 'April: Chikungunya cases rising with monsoon onset.', 'approved', 2),
('RPT-2024-012', 'Thane Chikungunya Cluster Report', 'outbreak', '2024-05-01', '2024-05-15', 'Thane', 'Chikungunya cluster detected in Thane West. 8 cases in 2 weeks.', 'approved', 9),
('RPT-2024-013', 'May 2024 Monthly Disease Summary', 'monthly', '2024-05-01', '2024-05-31', 'All', 'May: Monsoon diseases peaking. Dengue, Malaria, Chikungunya surge.', 'under_review', 3),
('RPT-2024-014', 'Dengue Surveillance Weekly Update W22', 'weekly', '2024-05-27', '2024-06-02', 'All', 'Dengue cases: 12 new, 8 recovered this week.', 'pending', 2),
('RPT-2024-015', 'June 2024 Monthly Report', 'monthly', '2024-06-01', '2024-06-30', 'All', 'Monsoon peak: highest case load. 22 new cases in June.', 'approved', 2),
('RPT-2024-016', 'H1 2024 Half-Year Review', 'custom', '2024-01-01', '2024-06-30', 'All', 'H1 2024 Summary: 60 cases, 38 recovered, 3 deceased. Recovery 76%.', 'approved', 2),
('RPT-2024-017', 'July 2024 Monthly Health Report', 'monthly', '2024-07-01', '2024-07-31', 'All', 'Post-monsoon: Dengue and Malaria persist. COVID-19 stable.', 'approved', 3),
('RPT-2024-018', 'Aurangabad Monthly Surveillance', 'monthly', '2024-07-01', '2024-07-31', 'Aurangabad', 'Aurangabad: 3 new chikungunya cases. Malaria 2 cases. All managed.', 'under_review', 10),
('RPT-2024-019', 'August 2024 Monthly Report', 'monthly', '2024-08-01', '2024-08-31', 'All', 'August: Malaria surge in Jalgaon and Nashik. DOTS compliance improving.', 'pending', 2),
('RPT-2024-020', 'COVID-19 Variant Surveillance Report', 'custom', '2024-08-01', '2024-08-31', 'All', 'COVID-19 variant monitoring: No new VOC detected in Maharashtra.', 'approved', 16),
('RPT-2024-021', 'September 2024 Monthly Report', 'monthly', '2024-09-01', '2024-09-30', 'All', 'September: Dengue declining. TB cases stable. COVID minimal.', 'approved', 2),
('RPT-2024-022', 'Post-Monsoon Disease Assessment', 'custom', '2024-09-01', '2024-09-30', 'All', 'Post-monsoon review: Dengue peaked at 25 cases in season.', 'under_review', 3),
('RPT-2024-023', 'October 2024 Monthly Report', 'monthly', '2024-10-01', '2024-10-31', 'All', 'October: Influenza season beginning. COVID booster campaign impact.', 'pending', 2),
('RPT-2024-024', 'Kolhapur Dengue Outbreak Report', 'outbreak', '2024-10-01', '2024-10-20', 'Kolhapur', 'Dengue cluster in Kolhapur rural. 4 cases in 3 weeks.', 'pending', 12),
('RPT-2024-025', 'Influenza Season Preparedness Report', 'custom', '2024-10-01', '2024-10-31', 'All', 'Influenza preparedness: Vaccine uptake 68%. Stock adequate.', 'approved', 16),
('RPT-2024-026', 'Q3 2024 Quarterly Review', 'custom', '2024-07-01', '2024-09-30', 'All', 'Q3 2024: 30 cases, 22 recovered, 1 death. Recovery rate 79%.', 'under_review', 2),
('RPT-2024-027', 'TB DOTS Program Progress Report', 'monthly', '2024-10-01', '2024-10-31', 'All', 'DOTS compliance: 89%. New enrollments: 8. Treatment success rate: 92%.', 'pending', 7),
('RPT-2024-028', 'Regional Performance Comparison Q3', 'custom', '2024-07-01', '2024-09-30', 'All', 'Mumbai led reporting compliance 95%. Jalgaon needs improvement.', 'approved', 2),
('RPT-2024-029', 'Malaria Elimination Progress Report', 'custom', '2024-01-01', '2024-10-31', 'All', 'Malaria cases: 14 YTD. 10% reduction from 2023. On track for elimination goal.', 'under_review', 11),
('RPT-2024-030', 'Annual Disease Burden Preliminary Report', 'custom', '2024-01-01', '2024-10-31', 'All', 'Preliminary annual: 100 cases across 10 regions. Recovery rate 74%.', 'pending', 2);

-- ============================================================
-- WORKFLOW TASKS (25 rows)
-- ============================================================
INSERT INTO workflow_tasks (task_id, title, description, assigned_to, case_id, priority, status, due_date, created_by) VALUES
('TASK-2024-001', 'Investigate Dengue Cluster - Dharavi Mumbai', 'Field investigation of dengue cluster in Dharavi. Vector survey and contact tracing required.', 4, 1, 'urgent', 'approved', '2024-01-10', 2),
('TASK-2024-002', 'Review TB DOTS Compliance - Nashik', 'Monthly review of DOTS therapy compliance in Nashik district.', 7, 4, 'high', 'approved', '2024-01-15', 3),
('TASK-2024-003', 'COVID-19 Contact Tracing - Mumbai', 'Trace contacts of case PAT-10003. Minimum 20 contacts to be identified.', 5, 3, 'high', 'under_review', '2024-01-12', 2),
('TASK-2024-004', 'Malaria Rapid Diagnostic - Nagpur', 'Deploy RDT kits in high-risk zones of Nagpur east. Target 200 tests.', 8, 9, 'urgent', 'approved', '2024-01-20', 11),
('TASK-2024-005', 'Chikungunya Vector Control - Thane', 'Fogging operation in affected zones of Thane. Coordinate with municipal body.', 9, 6, 'medium', 'pending', '2024-02-01', 3),
('TASK-2024-006', 'Dengue DHF Management Protocol Review', 'Review and update DHF management SOP for hospital staff.', 2, 16, 'high', 'approved', '2024-02-10', 1),
('TASK-2024-007', 'Monthly Report Preparation - February', 'Compile and submit February monthly epidemiology report.', 6, NULL, 'medium', 'approved', '2024-03-05', 3),
('TASK-2024-008', 'Malaria Cerebral Case Follow-up', 'Weekly follow-up of cerebral malaria patient PAT-10009.', 4, 9, 'urgent', 'under_review', '2024-02-01', 2),
('TASK-2024-009', 'TB Drug Sensitivity Testing - Nagpur', 'Coordinate DST for suspected MDR-TB case PAT-10010.', 11, 10, 'urgent', 'approved', '2024-01-28', 2),
('TASK-2024-010', 'Influenza Vaccination Drive - Kolhapur', 'Organize vaccination camp for elderly population in Kolhapur.', 12, NULL, 'medium', 'pending', '2024-03-15', 3),
('TASK-2024-011', 'Data Quality Audit - Q1 Reports', 'Audit data quality of Q1 2024 disease records for accuracy.', 18, NULL, 'medium', 'approved', '2024-04-15', 2),
('TASK-2024-012', 'Dengue Vector Index Survey - Pune', 'House index and container index survey in Pune West zone.', 17, 31, 'high', 'under_review', '2024-04-20', 3),
('TASK-2024-013', 'COVID-19 Booster Campaign Support', 'Support district health office for COVID-19 booster camp logistics.', 5, NULL, 'medium', 'approved', '2024-04-30', 2),
('TASK-2024-014', 'Chikungunya Joint Study - Aurangabad', 'Collect clinical data on joint complications in chikungunya cases.', 10, 20, 'low', 'pending', '2024-05-15', 3),
('TASK-2024-015', 'Drug-Resistant TB Case Management', 'Initiate bedaquiline protocol for drug-resistant TB case PAT-10050.', 7, 50, 'urgent', 'under_review', '2024-06-01', 11),
('TASK-2024-016', 'Monsoon Preparedness Assessment', 'Assess readiness of 10 regions for monsoon disease surge.', 3, NULL, 'high', 'approved', '2024-05-31', 2),
('TASK-2024-017', 'Malaria Blood Slide Examination Backlog', 'Clear backlog of 150 blood slides pending examination in Jalgaon.', 15, NULL, 'high', 'pending', '2024-07-01', 11),
('TASK-2024-018', 'Alert System Test - All Regions', 'Test disease alert notification system across all 10 regions.', 20, NULL, 'medium', 'approved', '2024-07-15', 1),
('TASK-2024-019', 'Regional Performance Review Meeting', 'Organize monthly performance review for all regional managers.', 2, NULL, 'medium', 'under_review', '2024-08-01', 1),
('TASK-2024-020', 'Dengue Entomological Investigation', 'Post-outbreak entomological investigation in Kolhapur rural area.', 12, 56, 'high', 'pending', '2024-10-25', 3),
('TASK-2024-021', 'TB Meningitis Case Monitoring - Jalgaon', 'Daily monitoring of TB meningitis ICU patient PAT-10079.', 15, 79, 'urgent', 'under_review', '2024-09-05', 11),
('TASK-2024-022', 'COVID-19 Long Haulers Registry Creation', 'Create registry of long COVID patients for follow-up program.', 19, NULL, 'medium', 'pending', '2024-10-01', 16),
('TASK-2024-023', 'Annual DOTS Achievement Report', 'Compile annual DOTS program achievement data for WHO submission.', 7, NULL, 'high', 'pending', '2024-11-15', 2),
('TASK-2024-024', 'Influenza Season Sentinel Surveillance', 'Activate sentinel surveillance sites for influenza season 2024-25.', 6, NULL, 'medium', 'rejected', '2024-10-15', 3),
('TASK-2024-025', 'Year-End Disease Burden Assessment', 'Compile comprehensive year-end disease burden data for annual report.', 18, NULL, 'high', 'pending', '2024-12-31', 2);

-- ============================================================
-- ALERTS (20 rows)
-- ============================================================
INSERT INTO alerts (alert_id, title, message, alert_type, severity, region, status, created_by) VALUES
('ALERT-2024-001', 'High CPU Usage - API Server', 'API Server CPU usage exceeded 85% for 10 consecutive minutes. Auto-scaling triggered.', 'cpu', 'high', NULL, 'resolved', 20),
('ALERT-2024-002', 'Dengue Outbreak Threshold Exceeded - Mumbai', 'Mumbai region has reported 5 dengue cases in 7 days. Outbreak threshold (3) exceeded.', 'outbreak', 'critical', 'Mumbai', 'active', 2),
('ALERT-2024-003', 'Memory Usage Warning - Database Server', 'MySQL database server memory usage at 78%. Consider scaling up.', 'memory', 'medium', NULL, 'resolved', 20),
('ALERT-2024-004', 'Malaria Cerebral Case Alert', 'Cerebral malaria case reported in Mumbai. Immediate specialist consultation required.', 'outbreak', 'critical', 'Mumbai', 'active', 2),
('ALERT-2024-005', 'Storage Usage Warning', 'Application storage at 65%. Archive old records or increase capacity.', 'storage', 'medium', NULL, 'acknowledged', 20),
('ALERT-2024-006', 'COVID-19 Death Reported - Nashik', 'COVID-19 related death reported in Nashik. Death investigation initiated.', 'outbreak', 'critical', 'Nashik', 'active', 3),
('ALERT-2024-007', 'Database Connection Pool Exhausted', 'MySQL connection pool temporarily exhausted. Queuing requests.', 'database', 'high', NULL, 'resolved', 20),
('ALERT-2024-008', 'TB Cluster Detected - Nashik Industrial Zone', 'Three TB cases identified at same workplace in Nashik. Cluster investigation required.', 'outbreak', 'high', 'Nashik', 'active', 7),
('ALERT-2024-009', 'Report Approval Backlog', 'More than 5 reports pending approval for over 7 days. Manager attention required.', 'service', 'medium', NULL, 'acknowledged', 1),
('ALERT-2024-010', 'Service Degradation - Report Generator', 'Report generation service responding slowly (>5s). Performance investigation underway.', 'service', 'medium', NULL, 'resolved', 20),
('ALERT-2024-011', 'Dengue ICU Admission - Critical', 'Pediatric dengue hemorrhagic fever with ICU admission in Pune. Age 8.', 'outbreak', 'critical', 'Pune', 'active', 6),
('ALERT-2024-012', 'Network Latency Spike', 'Network latency to RDS instance spiked to 120ms. Investigating.', 'network', 'medium', NULL, 'resolved', 20),
('ALERT-2024-013', 'Drug-Resistant TB Suspected - Nagpur', 'MDR-TB suspected in Nagpur. DST specimens sent to reference lab.', 'outbreak', 'high', 'Nagpur', 'active', 11),
('ALERT-2024-014', 'High Memory Usage - Application Server', 'Application server memory at 82%. Memory leak investigation initiated.', 'memory', 'high', NULL, 'acknowledged', 20),
('ALERT-2024-015', 'Chikungunya Cluster - Thane', 'Chikungunya cluster with 6 cases in Thane West ward in 2 weeks.', 'outbreak', 'high', 'Thane', 'active', 9),
('ALERT-2024-016', 'Dengue DHF - Kolhapur Pediatric', 'Pediatric Dengue Hemorrhagic Fever in Kolhapur. Platelet 20,000.', 'outbreak', 'critical', 'Kolhapur', 'active', 12),
('ALERT-2024-017', 'Scheduled Backup Failed', 'Nightly database backup job failed. Manual backup initiated.', 'database', 'high', NULL, 'resolved', 20),
('ALERT-2024-018', 'Cerebral Malaria Alert - Thane', 'Cerebral malaria with ICU admission in Thane. Neuro-ICU team alerted.', 'outbreak', 'critical', 'Thane', 'active', 9),
('ALERT-2024-019', 'TB Meningitis ICU Admission - Jalgaon', 'TB meningitis with poor prognosis in Jalgaon ICU. Priority monitoring.', 'outbreak', 'critical', 'Jalgaon', 'active', 15),
('ALERT-2024-020', 'COVID-19 4th Death - Satara', 'Fourth COVID-19 related death in Maharashtra this year. Immunocompromised patient.', 'outbreak', 'critical', 'Satara', 'active', 14);

-- ============================================================
-- AUDIT LOGS — Initial system entries
-- ============================================================
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description) VALUES
(1, 'LOGIN', 'AUTH', NULL, 'Admin initial system login'),
(1, 'CREATE', 'CASE', '1', 'System: Seed data imported'),
(2, 'LOGIN', 'AUTH', NULL, 'Manager Mumbai initial login'),
(3, 'LOGIN', 'AUTH', NULL, 'Manager Pune initial login');

-- Verify record counts
SELECT 'regions' as table_name, COUNT(*) as records FROM regions
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'disease_cases', COUNT(*) FROM disease_cases
UNION ALL SELECT 'reports', COUNT(*) FROM reports
UNION ALL SELECT 'workflow_tasks', COUNT(*) FROM workflow_tasks
UNION ALL SELECT 'alerts', COUNT(*) FROM alerts
UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs;
