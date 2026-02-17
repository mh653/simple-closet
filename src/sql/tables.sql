-- ※2/13　GUIからcodeをcoodeに変更

-- =========================================
-- t_categories（固定マスター）
-- =========================================
create table if not exists t_categories (
  id integer primary key,
  created_at timestamptz default now(),
  name text not null
);

insert into t_categories (id, name) values
(1,'トップス - 半袖/袖なし'),
(2,'トップス - 長袖'),
(3,'トップス - その他'),
(4,'ボトムス'),
(5,'オールインワン'),
(6,'アウター'),
(7,'靴'),
(8,'靴下'),
(9,'バッグ'),
(10,'アクセサリー'),
(11,'その他')
on conflict (id) do nothing;


-- =========================================
-- t_clothes
-- =========================================
create table if not exists t_clothes (
  id integer generated always as identity primary key,
  created_at timestamptz default now(),
  img_path text,
  category integer references t_categories(id),
  memo text
);

insert into t_clothes (img_path, category, memo) values
('1.jpg',2,'家で洗濯可能。'),
('2.jpg',4,'家で洗ったら色落ちした。ウエストが苦しいので食べ放題には不向き。'),
('3.jpg',6,'内ポケットがあって便利。'),
('4.jpg',3,'意外とほつれにくい。ドライクリーニングが必要。');


-- =========================================
-- t_tags
-- =========================================
create table if not exists t_tags (
  id integer generated always as identity primary key,
  created_at timestamptz default now(),
  name text
);

insert into t_tags (name) values
('寒い日'),
('とても寒い日'),
('雨'),
('仕事'),
('飲み会'),
('髪ボサボサでOK'),
('散歩');


-- =========================================
-- t_coordinations
-- =========================================
create table if not exists t_coordinations (
  id integer generated always as identity primary key,
  created_at timestamptz default now(),
  memo text,
  pin boolean default false
);

insert into t_coordinations (memo, pin) values
('ヒートテックは紺がベスト。', true),
('ポンチョが無いと地味。温度調節しにくい。', false);


-- =========================================
-- t_coode_clothes
-- on delete cascadeがあるので、t_coordinations(id)を削除すると連鎖して削除される
-- =========================================
create table if not exists t_coode_clothes (
  id integer generated always as identity primary key,
  created_at timestamptz default now(),
  coode_id integer references t_coordinations(id) on delete cascade,
  clothes_id integer references t_clothes(id) on delete cascade
);

insert into t_coode_clothes (coode_id, clothes_id) values
(1,1),(1,2),(1,3),(2,2),(2,4);


-- =========================================
-- t_coode_tags
-- =========================================
create table if not exists t_coode_tags (
  id integer generated always as identity primary key,
  created_at timestamptz default now(),
  coode_id integer references t_coordinations(id) on delete cascade,
  tags_id integer references t_tags(id) on delete cascade
);

insert into t_coode_tags (coode_id, tags_id) values
(1,1),(1,4),(1,6),(2,7);


-- =========================================
-- RLS 個人用
-- =========================================
alter table t_clothes enable row level security;
alter table t_tags enable row level security;
alter table t_coordinations enable row level security;
alter table t_coode_clothes enable row level security;
alter table t_coode_tags enable row level security;

create policy "allow all clothes" on t_clothes for all using (true) with check (true);
create policy "allow all tags" on t_tags for all using (true) with check (true);
create policy "allow all coord" on t_coordinations for all using (true) with check (true);
create policy "allow all coode_clothes" on t_coode_clothes for all using (true) with check (true);
create policy "allow all coode_tags" on t_coode_tags for all using (true) with check (true);








-- 2/17 コーデ追加のトランザクション化のため、SQL Editeorで下記RPCを追加
create or replace function insert_coordination(
  p_memo text,
  p_pin boolean,
  p_clothes int[],
  p_tags int[]
)
returns void
language plpgsql
as $$
declare
  new_coode_id int;
begin

  -- ① coordination
  insert into t_coordinations (memo, pin)
  values (p_memo, p_pin)
  returning id into new_coode_id;

  -- ② clothes
  insert into t_coode_clothes (coode_id, clothes_id)
  select new_coode_id, unnest(p_clothes);

  -- ③ tags
  insert into t_coode_tags (coode_id, tags_id)
  select new_coode_id, unnest(p_tags);

end;
$$;
