--updated sql code for Company_eval and Company with shorter primary key for testing purpose

CREATE TABLE Company_eval(
    company_username varchar(50) not null,
    entry_date datetime not null,
    green_credits float(20,3) not null,
    company_size int not null,
    revenue int not null,
    emission int not null,
    electricity int not null,
    natural_gas int not null,
    water int not null,
    total_waste int not null,
    recycled_waste int not null,
    primary key (company_username, entry_date, green_credits),
    foreign key (company_username, green_credits) references Company(company_username, green_credits)
);

CREATE TABLE Company(
    company_username varchar(50) not null,
    company_password varchar(50) not null,
    company_name varchar(50) not null,
    contact_name varchar(50) not null,
    contact_detail varchar(50) not null,
    company_details varchar(500) not null,
    green_credits float(20,3) not null,
    funds_required float(20,3),
    funds_received float(20,3),
    payment_id varchar(200) not null,
    primary key(company_username(30), payment_id(50), green_credits)
);