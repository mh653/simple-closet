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
-- バケット（public）
-- デモ画像4枚はGUIで追加
-- =========================================
insert into storage.buckets (id, name, public)
values ('clothes_image', 'clothes_image', true)
on conflict (id) do nothing;


-- =========================================
-- ポリシー
-- =========================================
-- 読み取りは誰でもOK
create policy "public read clothes"
on t_clothes
for select
using (true);

create policy "public read tags"
on t_tags
for select
using (true);

create policy "public read coord"
on t_coordinations
for select
using (true);

create policy "public read coode_clothes"
on t_coode_clothes
for select
using (true);

create policy "public read coode_tags"
on t_coode_tags
for select
using (true);

-- 書き込みはログイン時のみ
-- 服（アイテム）
create policy "auth insert clothes"
on t_clothes
for insert
with check (auth.uid() is not null);

create policy "auth update clothes"
on t_clothes
for update
using (auth.uid() is not null);

create policy "auth delete clothes"
on t_clothes
for delete
using (auth.uid() is not null);

-- タグ
create policy "auth insert tags"
on t_tags
for insert
with check (auth.uid() is not null);

create policy "auth update tags"
on t_tags
for update
using (auth.uid() is not null);

create policy "auth delete tags"
on t_tags
for delete
using (auth.uid() is not null);

-- コーデ
create policy "auth insert coordinations"
on t_coordinations
for insert
with check (auth.uid() is not null);

create policy "auth update coordinations"
on t_coordinations
for update
using (auth.uid() is not null);

create policy "auth delete coordinations"
on t_coordinations
for delete
using (auth.uid() is not null);

-- コーデと服（アイテム）
create policy "auth insert coode_clothes"
on t_coode_clothes
for insert
with check (auth.uid() is not null);

create policy "auth update coode_clothes"
on t_coode_clothes
for update
using (auth.uid() is not null);

create policy "auth delete coode_clothes"
on t_coode_clothes
for delete
using (auth.uid() is not null);

-- コーデとタグ
create policy "auth insert coode_tags"
on t_coode_tags
for insert
with check (auth.uid() is not null);

create policy "auth update coode_tags"
on t_coode_tags
for update
using (auth.uid() is not null);

create policy "auth delete coode_tags"
on t_coode_tags
for delete
using (auth.uid() is not null);

-- バケット
drop policy "allow upload qf0l9g_0" on storage.objects;
drop policy "allow delete clothes image" on storage.objects;

create policy "auth upload clothes image"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'clothes_image');

create policy "auth delete clothes image"
on storage.objects
for delete
to authenticated
using (bucket_id = 'clothes_image');

-- RPCも保護
revoke all on function insert_coordination from public;
revoke all on function update_coordination from public;
revoke all on function delete_clothes_with_image from public;

grant execute on function insert_coordination to authenticated;
grant execute on function update_coordination to authenticated;
grant execute on function delete_clothes_with_image to authenticated;



-- 2/15 GUIからこの内容で追加
CREATE POLICY "allow upload qf0l9g_0" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'clothes_image');


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


-- 2/17 服と画像削除のトランザクション化のため、SQL Editeorで下記RPCを追加
create or replace function delete_clothes_with_image(
  p_clothes_id int
)
returns text
language plpgsql
as $$
declare
  img text;
begin

  select img_path into img
  from t_clothes
  where id = p_clothes_id;

  delete from t_clothes
  where id = p_clothes_id;

  return img;

end;
$$;


-- 2/17 バケットの削除ポリシーも追加
create policy "allow delete clothes image"
on storage.objects
for delete
to anon
using (bucket_id = 'clothes_image');

-- 2/23 バケットから削除が上手くいってなかったが、selectポリシーも追加すると削除できるようになりました（clothesではなくitemsにしました）
create policy "auth select items image"
on storage.objects
for select
to authenticated
using (bucket_id = 'clothes_image');


-- 2/18 コーデ更新のトランザクション化のため、SQL Editeorで下記RPCを追加
-- create or replace function update_coordination(
--   p_coode_id int,
--   p_memo text,
--   p_pin boolean,
--   p_clothes int[],
--   p_tags int[]
-- )
-- returns void
-- language plpgsql
-- as $$
-- begin

--   -- メイン更新
--   update t_coordinations
--   set memo = p_memo,
--       pin = p_pin
--   where id = p_coode_id;

--   -- 服削除
--   delete from t_coode_clothes
--   where coode_id = p_coode_id;

--   -- 服insert
--   insert into t_coode_clothes (coode_id, clothes_id)
--   select p_coode_id, unnest(p_clothes);

--   -- タグ削除
--   delete from t_coode_tags
--   where coode_id = p_coode_id;

--   -- タグinsert
--   insert into t_coode_tags (coode_id, tag_id)
--   select p_coode_id, unnest(p_tags);

-- end;
-- $$;


-- ※↑がtagになっていたので2/23にtagsに修正
create or replace function update_coordination(
  p_coode_id int,
  p_memo text,
  p_pin boolean,
  p_clothes int[],
  p_tags int[]
)
returns void
language plpgsql
as $$
begin

  -- メイン更新
  update t_coordinations
  set memo = p_memo,
      pin = p_pin
  where id = p_coode_id;

  -- 服削除
  delete from t_coode_clothes
  where coode_id = p_coode_id;

  -- 服insert
  insert into t_coode_clothes (coode_id, clothes_id)
  select p_coode_id, unnest(p_clothes);

  -- タグ削除
  delete from t_coode_tags
  where coode_id = p_coode_id;

  -- 修正：tag_id → tags_id
  insert into t_coode_tags (coode_id, tags_id)
  select p_coode_id, unnest(p_tags);

end;
$$;



