CREATE TABLE Company(
    company_username varchar(50) primary key,
    company_password varchar(50) not null,
    company_name varchar(50) not null,
    contact_name varchar(50) not null,
    contact_detail varchar(50) not null,
    company_details varchar(500) not null,
    green_credits float(20,3) not null,
    funds_required float(20,3),
    funds_received float(20,3),
    payment_id varchar(200)
);

CREATE TABLE Company_eval(
    company_username varchar(50),
    company_size int not null,
    green_credits float(20,3) not null,
    -- To be determined later
    primary key (company_username),
    foreign key (company_username) references Company(company_username),
    foreign key (green_credits) references Company(green_credits)
);

CREATE TABLE Project{
    project_username varchar(50) primary key,
    project_password varchar(50) not null,
    project_name varchar(50) not null,
    -- Project association refers to what university or lab they work with to prevent unverified projects to register on the platform
    project_association varchar(50) not null,
    contact_name varchar(50) not null,
    contact_detail varchar(50) not null,
    project_details varchar(500) not null,
    funds_required float(20,3) not null
    funds_received float(20,3),
    payment_id varchar(200)
};

CREATE TABLE Company_Transaction{
    transaction_name varchar(50) not null,
    sender_username varchar(50),
    receiver_username varchar(50),
    amount_transferred varchar(50) not null,
    primary key (transaction_name, sender_username, receiver_username),
    foreign key (sender_username) references Company(company_username),
    foreign key (receiver_username) references Company(company_username)
};

CREATE TABLE Project_Transaction{
    transaction_name varchar(50) not null,
    sender_username varchar(50),
    receiver_username varchar(50),
    amount_transferred varchar(50) not null,
    primary key (transaction_name, sender_username, receiver_username),
    foreign key (sender_username) references Company(company_username),
    foreign key (receiver_username) references Project(project_username)
};