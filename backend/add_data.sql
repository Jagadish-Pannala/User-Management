INSERT INTO Role (role_name) VALUES
('Super Admin'),
('Admin'),
('User Manager'),
('General'),
('Support Agent');

select * from Role;

INSERT INTO User (first_name, last_name, mail, contact, password) VALUES
('Alice',   'Morgan',   'alice.morgan@example.com',   '9876543210',  'Alice@123'),
('Bob',     'Smith',    'bob.smith@example.com',      '9876543211',  'Bob@123'),
('Carol',   'Johnson',  'carol.johnson@example.com',  '9876543212',  'Carol@123'),
('Dave',    'Williams', 'dave.williams@example.com',  '9876543213',  'Dave@123'),
('Eve',     'Brown',    'eve.brown@example.com',      '9876543214',  'Eve@123'),
('Frank',   'Taylor',   'frank.taylor@example.com',   '9876543215',  'Frank@123'),
('Grace',   'Hall',     'grace.hall@example.com',     '9876543216',  'Grace@123'),
('Henry',   'Adams',    'henry.adams@example.com',    '9876543217',  'Henry@123'),
('Irene',   'Lopez',    'irene.lopez@example.com',    '9876543218',  'Irene@123');

INSERT INTO User_Role (user_id, role_id) VALUES
(1, 1), (1, 2),     -- Alice: Super Admin, Admin
(2, 2), (2, 5),     -- Bob: Admin, Support Agent
(3, 3),            -- Carol: User Manager
(4, 4),            -- Dave: General
(5, 5), (5, 4),     -- Eve: Support Agent, General
(6, 4),            -- Frank: General
(7, 4),            -- Grace: General
(8, 4),            -- Henry: General
(9, 5), (9, 2);     -- Irene: Support Agent, Admin

INSERT INTO Permissions (permission_code, description) VALUES
-- User Management
('VIEW_USER_PUBLIC',  'View basic profile of users excluding Admin and Super Admin'),
('VIEW_USER_ALL',     'View all users including Admin and Super Admin'),
('EDIT_OWN_PROFILE',  'Edit own profile'),
('EDIT_ANY_USER',     'Edit any user'),
('ADD_USER',          'Create a new user'),
('DELETE_USER',       'Delete a user'),

-- Role Management
('VIEW_ROLE',         'View roles'),
('ADD_ROLE',          'Create a new role'),
('EDIT_ROLE',         'Edit role'),
('DELETE_ROLE',       'Delete role'),

-- Permission Management
('VIEW_PERMISSION',   'View permissions'),
('ADD_PERMISSION',    'Add permission'),
('EDIT_PERMISSION',   'Edit permission'),
('DELETE_PERMISSION', 'Delete permission'),

-- Group Management
('VIEW_GROUP',        'View permission groups'),
('ADD_GROUP',         'Add permission group'),
('EDIT_GROUP',        'Edit permission group'),
('DELETE_GROUP',      'Delete permission group'),

-- Access Point
('MANAGE_ENDPOINTS',  'CRUD operations on access points');

INSERT INTO Permission_Group (group_name) VALUES
('User Management'),
('Role Management'),
('Permission Management'),
('Permission Group Management'),
('Access Point Management'),
('General User Permissions');

-- Group 1: User Management
INSERT INTO Permission_Group_Mapping (permission_id, group_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1);

-- Group 2: Role Management
INSERT INTO Permission_Group_Mapping (permission_id, group_id) VALUES
(7, 2), (8, 2), (9, 2), (10, 2);

-- Group 3: Permission Management
INSERT INTO Permission_Group_Mapping (permission_id, group_id) VALUES
(11, 3), (12, 3), (13, 3), (14, 3);

-- Group 4: Permission Group Management
INSERT INTO Permission_Group_Mapping (permission_id, group_id) VALUES
(15, 4), (16, 4), (17, 4), (18, 4);

-- Group 5: Access Point Management
INSERT INTO Permission_Group_Mapping (permission_id, group_id) VALUES
(19, 5);

-- Group 6: General User Permissions
INSERT INTO Permission_Group_Mapping (permission_id, group_id) VALUES
(1, 6), (3, 6);


-- Super Admin (All Groups)
INSERT INTO Role_Permission_Group (role_id, group_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6);

-- Admin
INSERT INTO Role_Permission_Group (role_id, group_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 6);


-- User Manager
INSERT INTO Role_Permission_Group (role_id, group_id) VALUES
(3, 1), (3, 6);

-- General
INSERT INTO Role_Permission_Group (role_id, group_id) VALUES
(4, 6);

-- Support Agent
INSERT INTO Role_Permission_Group (role_id, group_id) VALUES
(5, 1), (5, 6);

select * from user where user_id = 11;

select * from role;

select * from permissions;