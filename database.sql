CREATE TABLE Company(
    company_username varchar(50) not null,
    company_password varchar(50) not null,
    company_name varchar(50) not null,
    contact_name varchar(50) not null,
    contact_detail varchar(50) not null,
    company_details varchar(500) not null,
    total_credits float(20,3) not null,
    funds_required float(20,3),
    funds_received float(20,3),
    payment_id varchar(200) not null,
    primary key(company_username, payment_id)
);

CREATE TABLE Company_eval(
    company_username varchar(50) not null,
    entry_date datetime not null,
    green_credits float(20,3) not null,
    company_size int not null,
    revenue int not null,
    ghg_ratio float(20,3) not null,
    energy_ratio float(20,3) not null,
    water_ratio float(20,3) not null,
    waste_ratio float(20,3) not null,
    ghg_rating float(20,3) not null,
    energy_rating float(20,3) not null,
    water_rating float(20,3) not null,
    waste_rating float(20,3) not null,
    primary key (company_username, entry_date, green_credits),
    foreign key (company_username) references Company(company_username)
);


CREATE TABLE Project(
    project_username varchar(50) not null,
    project_password varchar(50) not null,
    project_name varchar(50) not null,
    -- Project association refers to what university or lab they work with to prevent unverified projects to register on the platform
    project_association varchar(50) not null,
    contact_name varchar(50) not null,
    contact_detail varchar(50) not null,
    project_details varchar(500) not null,
    funds_required float(20,3) not null,
    funds_received float(20,3),
    payment_id varchar(200) not null,
    primary key(project_username, payment_id)
);

CREATE TABLE Company_Transaction(
    payer_id varchar(200) not null,
    payee_id varchar(200) not null,
    transaction_name varchar(50) not null,
    sender_username varchar(50) not null,
    receiver_username varchar(50) not null,
    amount_transferred varchar(50) not null,
    credits_transferred varchar(50) not null,
    transfer_status varchar(10) default 'pending' check (transfer_status in ('pending', 'accepted', 'declined', 'canceled')),
    primary key (transaction_name, sender_username, receiver_username),
    foreign key (sender_username, payer_id) references Company(company_username, payment_id),
    foreign key (receiver_username, payee_id) references Company(company_username, payment_id)
);

CREATE TABLE Project_Transaction(
    payer_id varchar(200) not null,
    payee_id varchar(200) not null,
    transaction_name varchar(50) not null,
    sender_username varchar(50) not null,
    receiver_username varchar(50) not null,
    amount_transferred varchar(50) not null,
    credits_transferred varchar(50) not null,
    primary key (transaction_name, payer_id, payee_id),
    foreign key (sender_username, payer_id) references Company(company_username, payment_id),
    foreign key (receiver_username, payee_id) references Project(project_username, payment_id)
);