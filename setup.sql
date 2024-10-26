-- Downloaded from our ERD made on erd.dbdesigner.net

CREATE TABLE [users] (
	[id] int IDENTITY(1,1) NOT NULL UNIQUE,
	[first_name] nvarchar(50) NOT NULL,
	[last_name] nvarchar(50) NOT NULL,
	[username] nvarchar(50) NOT NULL UNIQUE,
	[password] nvarchar(50) NOT NULL UNIQUE,
	[street_address] nvarchar(50) NOT NULL,
	[phone] int NOT NULL,
	PRIMARY KEY ([id])
);

CREATE TABLE [files] (
	[id] int IDENTITY(1,1) NOT NULL UNIQUE,
	[filename] nvarchar(255) NOT NULL,
	[file_data] varbinary(max) NOT NULL,
	[file_size] int NOT NULL,
	[content_type] nvarchar(50) NOT NULL,
	[upload_date] rowversion NOT NULL DEFAULT 'NOW()',
	PRIMARY KEY ([id])
);

CREATE TABLE [roles] (
	[id] int IDENTITY(1,1) NOT NULL UNIQUE,
	[admin] bit NOT NULL DEFAULT 0,
	[owner] bit NOT NULL DEFAULT 1,
	[board] bit NOT NULL,
	[arc] bit NOT NULL DEFAULT 0,
	[roads] bit NOT NULL DEFAULT 0,
	[files_id] int NOT NULL,
	PRIMARY KEY ([id])
);

CREATE TABLE [users_roles] (
	[users_id] int IDENTITY(1,1) NOT NULL UNIQUE,
	[roles_id] int IDENTITY(1,1) NOT NULL UNIQUE,
	PRIMARY KEY ([users_id], [roles_id])
);

CREATE TABLE [Announcements] (
	[id] int IDENTITY(1,1) NOT NULL UNIQUE,
	[message] nvarchar(1000) NOT NULL,
	[datetime] rowversion NOT NULL,
	[title] nvarchar(max) NOT NULL,
	[formatted_date] nvarchar(max) NOT NULL,
	PRIMARY KEY ([id])
);

CREATE TABLE [sessions] (
	[id] int IDENTITY(1,1) NOT NULL UNIQUE,
	[user_id] int NOT NULL,
	[expires_time] rowversion NOT NULL,
	[created_time] rowversion NOT NULL,
	PRIMARY KEY ([id])
);



ALTER TABLE [roles] ADD CONSTRAINT [roles_fk6] FOREIGN KEY ([files_id]) REFERENCES [files]([id]);
ALTER TABLE [users_roles] ADD CONSTRAINT [users_roles_fk0] FOREIGN KEY ([users_id]) REFERENCES [users]([id]);
ALTER TABLE [users_roles] ADD CONSTRAINT [users_roles_fk1] FOREIGN KEY ([roles_id]) REFERENCES [roles]([id]);
ALTER TABLE [sessions] ADD CONSTRAINT [sessions_fk1] FOREIGN KEY ([user_id]) REFERENCES [users]([id]);